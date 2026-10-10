import { z } from 'zod';

export const AddToCartSchema = z.object({
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1').max(50, 'Max 50 items per line'),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative').max(50),
});

export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;

export interface CartItemDto {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  variantName?: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  stockAvailable: number;
  subtotal: number;
}

export interface CartDto {
  id: string;
  items: CartItemDto[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
  appliedCoupon?: string;
}
