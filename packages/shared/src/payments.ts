import { z } from 'zod';
import { PaymentGateway, PaymentStatus } from './enums.js';

export const RazorpayWebhookPayloadSchema = z.object({
  event: z.string(),
  payload: z.record(z.any()),
});

export const StripeWebhookPayloadSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.any()),
});

export interface CheckoutSessionResult {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  gatewayOrderId?: string;
  clientSecret?: string;
  razorpayKeyId?: string;
  redirectUrl?: string;
}

export interface RefundRequestInput {
  orderId: string;
  amount?: number;
  reason: string;
}
