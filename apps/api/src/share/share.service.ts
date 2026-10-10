import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  GenerateShareLinkInput,
  ShareLinkResponse,
  SharePlatform,
  buildInstagramCaption,
} from '@shopflow/shared';
import { customAlphabet } from 'nanoid';
import * as QRCode from 'qrcode';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

@Injectable()
export class ShareService {
  private readonly logger = new Logger(ShareService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateShareLink(input: GenerateShareLinkInput): Promise<ShareLinkResponse> {
    const product = await this.prisma.product.findUnique({
      where: { id: input.productId },
      include: { variants: true, category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const shortCode = nanoid();
    const platform = input.platform || SharePlatform.INSTAGRAM;
    const utmCampaign = input.customCampaign || product.slug;

    // Persist in DB
    const shareLink = await this.prisma.shareLink.create({
      data: {
        productId: product.id,
        shortCode,
        platform: platform.toUpperCase() as any,
        utmSource: platform,
        utmMedium: 'social',
        utmCampaign,
      },
    });

    const baseUrl = process.env.API_BASE_URL || 'http://localhost:4000';
    const shortUrl = `${baseUrl}/s/${shortCode}`;
    const deepLinkUrl = `shopflow://product/${product.slug}?utm_source=${platform}&utm_campaign=${utmCampaign}&ref=${shortCode}`;

    const lowestPrice = Math.min(...product.variants.map((v) => v.price));
    const compareAt = product.variants[0]?.compareAtPrice || undefined;

    const readyCaption = buildInstagramCaption({
      productTitle: product.title,
      price: lowestPrice,
      compareAtPrice: compareAt || undefined,
      currency: 'INR',
      shortUrl,
      tags: product.tags,
    });

    const qrCodeUrl = await QRCode.toDataURL(shortUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#111827', light: '#FFFFFF' },
    });

    const ogImages = {
      square1080: `${baseUrl}/share/og-image/${product.id}?format=square1080&discount=${input.discountPercent || 0}`,
      story1920: `${baseUrl}/share/og-image/${product.id}?format=story1920&discount=${input.discountPercent || 0}`,
      landscape1200: `${baseUrl}/share/og-image/${product.id}?format=landscape1200&discount=${input.discountPercent || 0}`,
    };

    return {
      id: shareLink.id,
      shortCode,
      shortUrl,
      deepLinkUrl,
      platform,
      utmParams: {
        source: platform,
        medium: 'social',
        campaign: utmCampaign,
      },
      ogImages,
      readyCaption,
      hashtags: product.tags.map((t) => `#${t.replace(/[^a-zA-Z0-9]/g, '')}`),
      qrCodeUrl,
    };
  }

  async trackAndResolveShortCode(shortCode: string): Promise<{ redirectUrl: string }> {
    const link = await this.prisma.shareLink.findUnique({
      where: { shortCode },
      include: { product: true },
    });

    if (!link) {
      throw new NotFoundException('Short share link not found or expired');
    }

    // Increment click count asynchronously
    await this.prisma.shareLink.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    });

    const webBaseUrl = process.env.WEB_BASE_URL || 'http://localhost:3000';
    const redirectUrl = `${webBaseUrl}/products/${link.product.slug}?utm_source=${link.utmSource}&utm_medium=${link.utmMedium}&utm_campaign=${link.utmCampaign}&ref=${link.shortCode}`;

    return { redirectUrl };
  }

  generateSvgOgImage(
    product: { title: string; price: number; compareAt?: number; image: string },
    format: 'square1080' | 'story1920' | 'landscape1200',
    discountPercent?: number,
  ): string {
    const dims = {
      square1080: { width: 1080, height: 1080 },
      story1920: { width: 1080, height: 1920 },
      landscape1200: { width: 1200, height: 630 },
    }[format];

    const discountBadge = discountPercent && discountPercent > 0
      ? `<rect x="50" y="50" width="220" height="60" rx="30" fill="#EF4444"/>
         <text x="160" y="88" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${discountPercent}% OFF</text>`
      : '';

    return `<svg width="${dims.width}" height="${dims.height}" viewBox="0 0 ${dims.width} ${dims.height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="${dims.width}" y2="${dims.height}" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0F172A"/>
          <stop offset="1" stop-color="#1E293B"/>
        </linearGradient>
        <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#6366F1"/>
          <stop offset="1" stop-color="#A855F7"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${dims.width}" height="${dims.height}" fill="url(#bgGrad)"/>
      <circle cx="${dims.width * 0.85}" cy="${dims.height * 0.2}" r="${dims.width * 0.35}" fill="#6366F1" opacity="0.12"/>
      <circle cx="${dims.width * 0.1}" cy="${dims.height * 0.85}" r="${dims.width * 0.3}" fill="#EC4899" opacity="0.12"/>

      <!-- Brand Logo / Header -->
      <g transform="translate(60, 60)">
        <rect width="48" height="48" rx="12" fill="url(#accentGrad)"/>
        <path d="M16 24L22 30L32 18" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="64" y="34" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">SHOPFLOW</text>
      </g>

      <!-- Discount Badge -->
      ${discountBadge}

      <!-- Product Title -->
      <text x="60" y="${dims.height * 0.45}" font-family="system-ui, -apple-system, sans-serif" font-size="46" font-weight="800" fill="#FFFFFF" width="${dims.width - 120}">
        ${escapeXml(product.title.slice(0, 45))}${product.title.length > 45 ? '...' : ''}
      </text>

      <!-- Price Section -->
      <g transform="translate(60, ${dims.height * 0.55})">
        <text x="0" y="50" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#10B981">₹${product.price.toLocaleString('en-IN')}</text>
        ${
          product.compareAt
            ? `<text x="280" y="46" font-family="system-ui, sans-serif" font-size="36" font-weight="500" fill="#94A3B8" text-decoration="line-through">₹${product.compareAt.toLocaleString('en-IN')}</text>`
            : ''
        }
      </g>

      <!-- CTA Button -->
      <g transform="translate(60, ${dims.height * 0.72})">
        <rect width="360" height="74" rx="37" fill="url(#accentGrad)"/>
        <text x="180" y="46" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF" text-anchor="middle">SHOP NOW 🛍️</text>
      </g>

      <!-- Footer Info -->
      <text x="60" y="${dims.height - 60}" font-family="system-ui, sans-serif" font-size="20" font-weight="500" fill="#64748B">
        ⚡ Express Delivery · Genuine Warranty · Easy 7-Day Returns
      </text>
    </svg>`;
  }
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
