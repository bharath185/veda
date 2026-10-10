import { z } from 'zod';

export const ProductVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(3),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  weight: z.number().positive().optional(),
});

export type ProductVariantInput = z.infer<typeof ProductVariantSchema>;

export const CreateProductSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(10),
  categoryId: z.string().min(1),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean().default(true),
  featured: z.boolean().default(false),
  variants: z.array(ProductVariantSchema).min(1, 'At least one variant is required'),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductFilterSchema = z.object({
  categoryId: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  rating: z.coerce.number().optional(),
  inStockOnly: z.coerce.boolean().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'rating', 'popular']).default('newest'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ProductFilterInput = z.infer<typeof ProductFilterSchema>;

export const CreateCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
