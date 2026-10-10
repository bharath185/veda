import { z } from 'zod';
import { OrderStatus, PaymentGateway, PaymentMethod } from './enums.js';

export const CreateAddressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  street: z.string().min(5),
  apartment: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2).default('IN'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isDefault: z.boolean().default(false),
});

export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;

export const CreateCheckoutSessionSchema = z.object({
  shippingAddressId: z.string().min(1),
  billingAddressId: z.string().optional(),
  gateway: z.nativeEnum(PaymentGateway),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>;

export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  comment: z.string().optional(),
  trackingNumber: z.string().optional(),
  courier: z.string().optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

export const CancelOrderSchema = z.object({
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
});

export type CancelOrderInput = z.infer<typeof CancelOrderSchema>;

export const ReturnOrderSchema = z.object({
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  itemIds: z.array(z.string()).min(1, 'Select at least one item to return'),
});

export type ReturnOrderInput = z.infer<typeof ReturnOrderSchema>;
