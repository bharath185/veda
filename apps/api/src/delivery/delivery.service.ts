import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryGateway } from './delivery.gateway';
import {
  DeliveryLocationPing,
  UpdateDeliveryOrderStatusInput,
  OrderStatus,
  DeliveryAssignmentDto,
} from '@shopflow/shared';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly deliveryGateway: DeliveryGateway,
  ) {}

  private async getAgent(userId: string) {
    const agent = await this.prisma.deliveryAgent.findUnique({
      where: { userId },
    });
    if (!agent) {
      throw new ForbiddenException('User is not registered as a delivery agent');
    }
    return agent;
  }

  async getAssignments(userId: string): Promise<DeliveryAssignmentDto[]> {
    const agent = await this.getAgent(userId);

    const shipments = await this.prisma.shipment.findMany({
      where: {
        OR: [
          { agentId: agent.id },
          { agentId: null, order: { status: { in: [OrderStatus.PAID, OrderStatus.PACKED] } } },
        ],
      },
      include: {
        order: {
          include: {
            user: true,
            shippingAddress: true,
            items: true,
            payments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return shipments.map((s) => ({
      id: s.id,
      orderId: s.order.id,
      orderNumber: s.order.orderNumber,
      customerName: s.order.shippingAddress?.fullName || s.order.user.name,
      customerPhone: s.order.shippingAddress?.phone || s.order.user.phone || '',
      deliveryAddress: {
        street: s.order.shippingAddress?.street || '',
        city: s.order.shippingAddress?.city || '',
        postalCode: s.order.shippingAddress?.postalCode || '',
        latitude: s.order.shippingAddress?.latitude || 12.9716,
        longitude: s.order.shippingAddress?.longitude || 77.6412,
      },
      items: s.order.items.map((i) => ({
        name: i.titleSnapshot,
        quantity: i.quantity,
        sku: i.skuSnapshot,
      })),
      status: s.order.status as OrderStatus,
      paymentMode: s.order.payments[0]?.gateway === 'COD' ? 'Cash on Delivery (COD)' : 'Prepaid Online',
      amountToCollect: s.order.payments[0]?.gateway === 'COD' ? s.order.totalAmount : 0,
      assignedAt: s.createdAt.toISOString(),
    }));
  }

  async updateDeliveryStatus(
    userId: string,
    orderId: string,
    input: UpdateDeliveryOrderStatusInput,
  ) {
    const agent = await this.getAgent(userId);

    const shipment = await this.prisma.shipment.findFirst({
      where: { orderId },
      include: { order: true },
    });

    if (!shipment) {
      throw new NotFoundException('Shipment record not found for this order');
    }

    // Assign agent to shipment if not already
    if (!shipment.agentId) {
      await this.prisma.shipment.update({
        where: { id: shipment.id },
        data: { agentId: agent.id },
      });
    }

    // Verify OTP if status is DELIVERED
    if (input.status === OrderStatus.DELIVERED) {
      if (shipment.deliveryOtp && input.customerOtp && shipment.deliveryOtp !== input.customerOtp) {
        throw new BadRequestException('Invalid Customer Delivery OTP');
      }
    }

    const history = (shipment.statusHistory as any[]) || [];
    history.push({
      status: input.status,
      timestamp: new Date().toISOString(),
      notes: input.notes,
      failureReason: input.failureReason,
    });

    const isDelivered = input.status === OrderStatus.DELIVERED;

    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: input.status,
          deliveredAt: isDelivered ? new Date() : undefined,
        },
      }),
      this.prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          statusHistory: history,
          proofPhotoUrl: input.proofPhotoUrl,
        },
      }),
      ...(isDelivered
        ? [
            this.prisma.deliveryAgent.update({
              where: { id: agent.id },
              data: {
                totalDeliveries: { increment: 1 },
                currentOrders: { decrement: 1 },
              },
            }),
          ]
        : []),
    ]);

    // Broadcast real-time status update to connected tracking clients
    this.deliveryGateway.emitStatusUpdate(orderId, {
      status: input.status,
      timestamp: new Date().toISOString(),
      message: input.notes || `Order is now ${input.status}`,
    });

    return { success: true, status: input.status };
  }

  async recordLocationPing(userId: string, ping: DeliveryLocationPing) {
    const agent = await this.getAgent(userId);

    const shipment = await this.prisma.shipment.findFirst({
      where: { orderId: ping.orderId },
    });

    if (shipment) {
      await this.prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          liveLatitude: ping.latitude,
          liveLongitude: ping.longitude,
        },
      });

      // Broadcast live GPS update to customers listening on WebSocket
      this.deliveryGateway.emitLocationUpdate(ping.orderId, {
        lat: ping.latitude,
        lng: ping.longitude,
        speed: ping.speed,
        heading: ping.heading,
      });
    }

    return { recorded: true };
  }

  async getEarnings(userId: string) {
    const agent = await this.getAgent(userId);

    const perOrderPayout = 65; // ₹65 per delivery
    const baseDailyAllowance = 250; // Daily incentive
    const completedToday = 8;
    const completedThisWeek = agent.totalDeliveries > 0 ? agent.totalDeliveries : 32;

    const todayEarnings = completedToday * perOrderPayout + baseDailyAllowance;
    const weeklyEarnings = completedThisWeek * perOrderPayout + baseDailyAllowance * 6;

    return {
      agentId: agent.id,
      rating: agent.rating,
      totalDeliveries: agent.totalDeliveries,
      payoutRatePerOrder: perOrderPayout,
      today: {
        completedOrders: completedToday,
        earnings: todayEarnings,
      },
      week: {
        completedOrders: completedThisWeek,
        earnings: weeklyEarnings,
      },
    };
  }
}
