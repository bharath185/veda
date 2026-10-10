import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput, ProductFilterInput, UpdateProductSchema } from '@shopflow/shared';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: ProductFilterInput) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
      deletedAt: null,
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.rating) {
      where.avgRating = { gte: filters.rating };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { has: filters.search.toLowerCase() } },
      ];
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.variants = {
        some: {
          price: {
            gte: filters.minPrice,
            lte: filters.maxPrice,
          },
        },
      };
    }

    if (filters.inStockOnly) {
      where.variants = {
        ...(where.variants || {}),
        some: {
          stock: { gt: 0 },
        },
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (filters.sort === 'price_asc') {
      orderBy = { variants: { _count: 'asc' } }; // or sort in query
    } else if (filters.sort === 'rating') {
      orderBy = { avgRating: 'desc' };
    } else if (filters.sort === 'popular') {
      orderBy = { reviewCount: 'desc' };
    }

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: {
            where: { deletedAt: null },
            select: {
              id: true,
              sku: true,
              size: true,
              color: true,
              price: true,
              compareAtPrice: true,
              stock: true,
            },
          },
        },
      }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          where: { deletedAt: null },
          include: {
            inventories: true,
          },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });

    if (!product || product.deletedAt) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    // Generate schema.org JSON-LD
    const lowestPrice = Math.min(...product.variants.map((v) => v.price));
    const highestPrice = Math.max(...product.variants.map((v) => v.price));
    const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description,
      image: product.images,
      sku: product.variants[0]?.sku,
      category: product.category?.name,
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: lowestPrice,
        highPrice: highestPrice,
        offerCount: product.variants.length,
        availability: totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      aggregateRating: product.reviewCount > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: product.avgRating.toFixed(1),
        reviewCount: product.reviewCount,
      } : undefined,
    };

    return {
      product,
      jsonLd,
    };
  }

  async search(query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    return this.prisma.product.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query.toLowerCase()] } },
        ],
      },
      take: 10,
      include: {
        category: { select: { name: true, slug: true } },
        variants: {
          select: { price: true, compareAtPrice: true, stock: true },
          take: 1,
        },
      },
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      include: {
        children: true,
        _count: { select: { products: true } },
      },
    });
  }

  async create(input: CreateProductInput) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: input.slug },
    });
    if (existing) {
      throw new BadRequestException(`Product with slug "${input.slug}" already exists`);
    }

    const { variants, ...productData } = input;
    return this.prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants.map((v) => ({
            sku: v.sku,
            size: v.size,
            color: v.color,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stock: v.stock,
            weight: v.weight,
            inventories: {
              create: {
                warehouse: 'MAIN_HUB_BANGALORE',
                quantity: v.stock,
              },
            },
          })),
        },
      },
      include: {
        variants: true,
      },
    });
  }

  async bulkImportCsv(csvContent: string) {
    const lines = csvContent.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      throw new BadRequestException('CSV must contain a header and at least one data row');
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const row: any = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx];
      });

      if (!row.title || !row.slug || !row.price || !row.categoryid) continue;

      const price = parseFloat(row.price);
      const stock = parseInt(row.stock || '10', 10);

      await this.prisma.product.upsert({
        where: { slug: row.slug },
        update: {
          title: row.title,
          description: row.description || row.title,
        },
        create: {
          title: row.title,
          slug: row.slug,
          description: row.description || `Imported product ${row.title}`,
          categoryId: row.categoryid,
          images: [row.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80'],
          variants: {
            create: {
              sku: `CSV-${row.slug.toUpperCase()}-01`,
              price,
              stock,
            },
          },
        },
      });
      imported++;
    }

    return { importedCount: imported };
  }
}
