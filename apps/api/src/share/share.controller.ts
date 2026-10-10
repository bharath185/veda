import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ShareService } from './share.service';
import { GenerateShareLinkSchema, GenerateShareLinkInput } from '@shopflow/shared';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Share Links & OG Generator')
@Controller()
export class ShareController {
  constructor(
    private readonly shareService: ShareService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('share/generate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate Instagram/social short link, UTM tags, caption, and OG assets' })
  async generateShareLink(
    @Body(new ZodValidationPipe(GenerateShareLinkSchema)) input: GenerateShareLinkInput,
  ) {
    return this.shareService.generateShareLink(input);
  }

  @Get('s/:shortCode')
  @ApiOperation({ summary: '302 redirect short link with UTM tracking attribution' })
  async handleShortLinkRedirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const { redirectUrl } = await this.shareService.trackAndResolveShortCode(shortCode);
    return res.redirect(HttpStatus.FOUND, redirectUrl);
  }

  @Get('share/og-image/:productId')
  @ApiOperation({ summary: 'Serve dynamic product OG image (1080x1080, 1080x1920, 1200x630)' })
  async getOgImage(
    @Param('productId') productId: string,
    @Query('format') format: 'square1080' | 'story1920' | 'landscape1200' = 'square1080',
    @Query('discount') discount: string,
    @Res() res: Response,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).send('Product not found');
    }

    const price = product.variants[0]?.price || 999;
    const compareAt = product.variants[0]?.compareAtPrice || undefined;
    const discountPercent = discount ? parseInt(discount, 10) : undefined;

    const svg = this.shareService.generateSvgOgImage(
      {
        title: product.title,
        price,
        compareAt,
        image: product.images[0] || '',
      },
      format,
      discountPercent,
    );

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.send(svg);
  }
}
