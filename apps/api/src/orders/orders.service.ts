import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  OrderStatus,
  UpdateOrderStatusInput,
  CancelOrderInput,
  ReturnOrderInput,
} from '@shopflow/shared';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        payments: true,
        shipments: true,
        shippingAddress: true,
      },
    });
  }

  async getOrderById(orderId: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        payments: true,
        shipments: {
          include: { agent: { include: { user: { select: { name: true, phone: true } } } } },
        },
        shippingAddress: true,
        billingAddress: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (userId && order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  async getAllOrders(status?: OrderStatus, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [total, items] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
          payments: true,
          shipments: true,
        },
      }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOrderStatus(orderId: string, input: UpdateOrderStatusInput) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: input.status,
        deliveredAt: input.status === OrderStatus.DELIVERED ? new Date() : undefined,
      },
      include: { shipments: true },
    });

    // Update shipment status history if exists
    if (updated.shipments.length > 0) {
      const shipment = updated.shipments[0];
      const history = (shipment.statusHistory as any[]) || [];
      history.push({
        status: input.status,
        timestamp: new Date().toISOString(),
        message: input.comment || `Order updated to ${input.status}`,
      });

      await this.prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          statusHistory: history,
          trackingNumber: input.trackingNumber || shipment.trackingNumber,
          courier: input.courier || shipment.courier,
        },
      });
    }

    return updated;
  }

  async cancelOrder(userId: string, orderId: string, input: CancelOrderInput) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.status === OrderStatus.SHIPPED ||
      order.status === OrderStatus.OUT_FOR_DELIVERY ||
      order.status === OrderStatus.DELIVERED
    ) {
      throw new BadRequestException('Cannot cancel order after it has been shipped or delivered');
    }

    return this.prisma.$transaction(async (tx) => {
      // Restore inventory
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          cancellationReason: input.reason,
          cancelledAt: new Date(),
        },
      });
    });
  }

  async returnOrder(userId: string, orderId: string, input: ReturnOrderInput) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Only delivered orders can be requested for return');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.RETURNED,
        notes: `Return requested: ${input.reason}`,
      },
    });
  }
}
