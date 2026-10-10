import { Test, TestingModule } from '@nestjs/testing';
import { ShareService } from '../src/share/share.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { SharePlatform, buildInstagramCaption } from '@shopflow/shared';

describe('ShareService (Instagram Share Generator & OG)', () => {
  let shareService: ShareService;
  let prismaService: any;

  beforeEach(async () => {
    prismaService = {
      product: {
        findUnique: jest.fn(),
      },
      shareLink: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShareService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    shareService = module.get<ShareService>(ShareService);
  });

  it('should generate Instagram caption with formatted discount, hashtags and bio note', () => {
    const caption = buildInstagramCaption({
      productTitle: 'Aura Pro 5G Flagship',
      price: 69999,
      compareAtPrice: 79999,
      currency: 'INR',
      shortUrl: 'http://localhost:4000/s/xyz123',
      tags: ['flagship', '5g', 'deals'],
    });

    expect(caption).toContain('Aura Pro 5G Flagship');
    expect(caption).toContain('₹69999');
    expect(caption).toContain('13% OFF');
    expect(caption).toContain('http://localhost:4000/s/xyz123');
    expect(caption).toContain('#flagship');
    expect(caption).toContain('#5g');
  });

  it('should render SVG OG image with exact 1080x1080 dimensions for Instagram feed', () => {
    const svg = shareService.generateSvgOgImage(
      {
        title: 'Aura Pro 5G Flagship Smartphone',
        price: 69999,
        compareAt: 79999,
        image: 'https://example.com/image.jpg',
      },
      'square1080',
      13,
    );

    expect(svg).toContain('width="1080"');
    expect(svg).toContain('height="1080"');
    expect(svg).toContain('13% OFF');
    expect(svg).toContain('₹69,999');
    expect(svg).toContain('SHOPFLOW');
  });

  it('should render SVG Story image with 1080x1920 dimensions for Instagram Story', () => {
    const svg = shareService.generateSvgOgImage(
      {
        title: 'Aura Pro 5G Flagship Smartphone',
        price: 69999,
        compareAt: 79999,
        image: 'https://example.com/image.jpg',
      },
      'story1920',
      13,
    );

    expect(svg).toContain('width="1080"');
    expect(svg).toContain('height="1920"');
  });
});
