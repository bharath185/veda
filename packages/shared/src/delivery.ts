import { z } from 'zod';
import { OrderStatus } from './enums.js';

export const DeliveryLocationPingSchema = z.object({
  orderId: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  speed: z.number().optional(),
  heading: z.number().optional(),
  batteryLevel: z.number().optional(),
  timestamp: z.number().default(() => Date.now()),
});

export type DeliveryLocationPing = z.infer<typeof DeliveryLocationPingSchema>;

export const UpdateDeliveryOrderStatusSchema = z.object({
  status: z.enum([OrderStatus.PACKED, OrderStatus.SHIPPED, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED, OrderStatus.RETURNED]),
  proofPhotoUrl: z.string().url().optional(),
  customerOtp: z.string().length(4, 'Delivery OTP is 4 digits').optional(),
  failureReason: z.string().optional(),
  notes: z.string().optional(),
});

export type UpdateDeliveryOrderStatusInput = z.infer<typeof UpdateDeliveryOrderStatusSchema>;

export interface DeliveryAssignmentDto {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  };
  items: Array<{
    name: string;
    quantity: number;
    sku: string;
  }>;
  status: OrderStatus;
  paymentMode: string;
  amountToCollect: number;
  assignedAt: string;
}
