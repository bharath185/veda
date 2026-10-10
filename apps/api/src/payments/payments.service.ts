import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaymentGateway,
  PaymentStatus,
  OrderStatus,
  CreateCheckoutSessionInput,
  CheckoutSessionResult,
  RefundRequestInput,
} from '@shopflow/shared';
import * as crypto from 'crypto';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripeClient: Stripe | null = null;
  private razorpayClient: Razorpay | null = null;

  constructor(private readonly prisma: PrismaService) {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-01-27.acacia' as any,
      });
    }

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpayClient = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
  }

  async createCheckoutSession(
    userId: string,
    input: CreateCheckoutSessionInput,
    idempotencyKey?: string,
  ): Promise<CheckoutSessionResult> {
    // 1. Fetch user cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    // 2. Verify stock for each item
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${item.variant.product.title}". Available: ${item.variant.stock}`,
        );
      }
    }

    // 3. Calculate pricing
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0,
    );
    let discountAmount = 0;
    let couponId: string | null = null;

    if (input.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: input.couponCode.toUpperCase() },
      });
      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (subtotal >= coupon.minOrderValue) {
          couponId = coupon.id;
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }
        }
      }
    }

    const taxAmount = Math.round((subtotal - discountAmount) * 0.18);
    const shippingAmount = subtotal > 1000 ? 0 : 99;
    const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;

    // 4. Create Order in DB
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.PENDING,
          currency: input.gateway === PaymentGateway.STRIPE ? 'USD' : 'INR',
          subtotal,
          discountAmount,
          taxAmount,
          shippingAmount,
          totalAmount,
          shippingAddressId: input.shippingAddressId,
          billingAddressId: input.billingAddressId || input.shippingAddressId,
          couponId,
          notes: input.notes,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              titleSnapshot: item.variant.product.title,
              skuSnapshot: item.variant.sku,
              priceSnapshot: item.variant.price,
              imageSnapshot: item.variant.product.images[0] || '',
              quantity: item.quantity,
              subtotal: item.variant.price * item.quantity,
            })),
          },
        },
      });

      // Clear the user's cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    // 5. Gateway Handling
    if (input.gateway === PaymentGateway.COD) {
      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          gateway: PaymentGateway.COD,
          status: PaymentStatus.PENDING,
          amount: totalAmount,
          currency: 'INR',
          method: 'COD' as any,
          idempotencyKey,
        },
      });

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: totalAmount,
        currency: 'INR',
        gateway: PaymentGateway.COD,
        redirectUrl: `/order-success?orderId=${order.id}`,
      };
    }

    if (input.gateway === PaymentGateway.RAZORPAY) {
      let rzpOrderId = `rzp_mock_${order.id.slice(0, 8)}`;
      if (this.razorpayClient) {
        try {
          const rzpOrder = await this.razorpayClient.orders.create({
            amount: Math.round(totalAmount * 100), // in paise
            currency: 'INR',
            receipt: order.orderNumber,
            notes: { orderId: order.id },
          });
          rzpOrderId = rzpOrder.id;
        } catch (e: any) {
          this.logger.warn(`Razorpay live order failed: ${e.message}. Using fallback intent.`);
        }
      }

      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          gateway: PaymentGateway.RAZORPAY,
          gatewayTxnId: rzpOrderId,
          status: PaymentStatus.PENDING,
          amount: totalAmount,
          currency: 'INR',
          idempotencyKey,
        },
      });

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: totalAmount,
        currency: 'INR',
        gateway: PaymentGateway.RAZORPAY,
        gatewayOrderId: rzpOrderId,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_shopflow_mock_key',
      };
    }

    if (input.gateway === PaymentGateway.STRIPE) {
      let clientSecret = `pi_mock_secret_${order.id.slice(0, 8)}`;
      if (this.stripeClient) {
        try {
          const paymentIntent = await this.stripeClient.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // in cents
            currency: 'usd',
            metadata: { orderId: order.id, orderNumber: order.orderNumber },
          });
          clientSecret = paymentIntent.client_secret || clientSecret;
        } catch (e: any) {
          this.logger.warn(`Stripe live intent failed: ${e.message}. Using fallback intent.`);
        }
      }

      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          gateway: PaymentGateway.STRIPE,
          status: PaymentStatus.PENDING,
          amount: totalAmount,
          currency: 'USD',
          idempotencyKey,
        },
      });

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: totalAmount,
        currency: 'USD',
        gateway: PaymentGateway.STRIPE,
        clientSecret,
      };
    }

    throw new BadRequestException('Unsupported payment gateway');
  }

  async verifyRazorpayWebhook(payload: any, signature: string): Promise<{ received: boolean }> {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'shopflow_rzp_webhook_secret_key_12345';
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== expectedSignature && process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Invalid Razorpay signature');
    }

    const event = payload.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.notes?.orderId;
      if (orderId) {
        await this.fulfillOrder(orderId, paymentEntity.id, 'UPI');
      }
    }

    return { received: true };
  }

  async verifyStripeWebhook(rawBody: Buffer, signature: string): Promise<{ received: boolean }> {
    let event: Stripe.Event;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_shopflow_mock_stripe_webhook_secret_12345';

    if (this.stripeClient) {
      try {
        event = this.stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
      }
    } else {
      event = JSON.parse(rawBody.toString());
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        await this.fulfillOrder(orderId, paymentIntent.id, 'CARD');
      }
    }

    return { received: true };
  }

  private async fulfillOrder(orderId: string, txnId: string, method: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.status === OrderStatus.PAID) return;

    await this.prisma.$transaction(async (tx) => {
      // 1. Mark Order as PAID
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID },
      });

      // 2. Mark Payment as SUCCESS
      await tx.payment.updateMany({
        where: { orderId },
        data: {
          status: PaymentStatus.SUCCESS,
          gatewayTxnId: txnId,
          method: method as any,
        },
      });

      // 3. Decrement Inventory for items
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 4. Create Shipment Record & Tracking Number
      const trackingNumber = `SFX-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`;

      await tx.shipment.create({
        data: {
          orderId,
          trackingNumber,
          courier: 'ShopFlow Express',
          deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
          statusHistory: [
            {
              status: OrderStatus.PAID,
              timestamp: new Date().toISOString(),
              message: 'Payment verified and order confirmed.',
            },
          ],
        },
      });
    });

    this.logger.log(`Order ${orderId} successfully fulfilled and stock decremented.`);
  }

  async processRefund(input: RefundRequestInput) {
    const order = await this.prisma.order.findUnique({
      where: { id: input.orderId },
      include: { payments: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    const successfulPayment = order.payments.find((p) => p.status === PaymentStatus.SUCCESS);
    if (!successfulPayment) {
      throw new BadRequestException('No successful payment found to refund');
    }

    const refundAmount = input.amount || order.totalAmount;

    await this.prisma.payment.update({
      where: { id: successfulPayment.id },
      data: {
        status: PaymentStatus.REFUNDED,
        refunds: [
          {
            amount: refundAmount,
            reason: input.reason,
            refundedAt: new Date().toISOString(),
          },
        ],
      },
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.CANCELLED, cancellationReason: input.reason },
    });

    return {
      success: true,
      refundAmount,
      orderId: order.id,
    };
  }
}
