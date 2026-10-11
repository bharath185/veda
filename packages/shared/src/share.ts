import { z } from 'zod';
import { SharePlatform } from './enums.js';

export const GenerateShareLinkSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  platform: z.nativeEnum(SharePlatform).default(SharePlatform.INSTAGRAM),
  customCampaign: z.string().optional(),
  discountPercent: z.number().min(0).max(100).optional(),
});

export type GenerateShareLinkInput = z.infer<typeof GenerateShareLinkSchema>;

export interface ShareLinkResponse {
  id: string;
  shortCode: string;
  shortUrl: string;
  deepLinkUrl: string;
  platform: SharePlatform;
  utmParams: {
    source: string;
    medium: string;
    campaign: string;
  };
  ogImages: {
    square1080: string; // 1080x1080 for Instagram Feed
    story1920: string;  // 1080x1920 for Instagram Story
    landscape1200: string; // 1200x630 for WhatsApp / Twitter
  };
  readyCaption: string;
  hashtags: string[];
  qrCodeUrl: string;
}

export function buildInstagramCaption(params: {
  productTitle: string;
  price: number;
  compareAtPrice?: number;
  currency?: string;
  shortUrl: string;
  tags?: string[];
}): string {
  const currencySymbol = params.currency === 'USD' ? '$' : '₹';
  const discountText =
    params.compareAtPrice && params.compareAtPrice > params.price
      ? ` 🌿 ${(Math.round(((params.compareAtPrice - params.price) / params.compareAtPrice) * 100))}% OFF (was ${currencySymbol}${params.compareAtPrice})`
      : '';

  const hashtags = (params.tags || [])
    .map((tag) => `#${tag.replace(/[^a-zA-Z0-9]/g, '')}`)
    .slice(0, 10)
    .join(' ');

  return `🌿 PURE AYURVEDA WELLNESS: ${params.productTitle} 🌿\n\n` +
    `100% Authentic, Lab-Tested Classical Formulation.\n` +
    `Available now for only ${currencySymbol}${params.price}!${discountText}\n\n` +
    `✅ Non-Pharma Herbal Formulation\n` +
    `✅ AYUSH Premium Certified · Zero Heavy Metals\n` +
    `✅ Clinically Backed Botanicals\n\n` +
    `🛒 Tap the link in bio or order directly: ${params.shortUrl}\n` +
    `⚡ Free Express Delivery on orders above ₹999\n\n` +
    `${hashtags || '#ayurveda #herbalremedy #holisticwellness #doshabalance #pureherbs'}`;
}
