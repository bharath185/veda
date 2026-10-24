import { NextResponse } from 'next/server';
import { allAyurvedicProducts, AyurvedicProduct } from '../../../data/ayurvedaCatalog';

// In-memory catalog state for serverless execution
let serverProducts: AyurvedicProduct[] = [...allAyurvedicProducts];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const slug = searchParams.get('slug');

  let result = [...serverProducts];

  if (slug) {
    const single = result.find((p) => p.slug === slug);
    if (!single) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product: single });
  }

  if (category) {
    result = result.filter((p) => p.categorySlug === category);
  }

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    products: result,
    total: result.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.price) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
    }

    const newId = `vd-prod-${Date.now().toString(36)}`;
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newProduct: AyurvedicProduct = {
      id: newId,
      title: body.title,
      slug,
      categorySlug: body.categorySlug || 'classical-rasayanas',
      categoryName: body.categoryName || 'Classical Rasayanas & Remedies',
      price: Number(body.price),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : Math.round(Number(body.price) * 1.2),
      discountPct: body.discountPct
        ? Number(body.discountPct)
        : Math.round(((Number(body.compareAtPrice || Number(body.price) * 1.2) - Number(body.price)) / Number(body.compareAtPrice || Number(body.price) * 1.2)) * 100),
      rating: body.rating ? Number(body.rating) : 4.8,
      reviews: body.reviews ? Number(body.reviews) : 12,
      image:
        body.image ||
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : ['Classical Herb', 'AYUSH Certified']),
      stock: body.stock !== undefined ? Number(body.stock) : 50,
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      formulationType: body.formulationType || 'Classical Ayurvedic Medicine',
      dosage: body.dosage || '1-2 doses daily with lukewarm water or A2 milk',
      classicalText: body.classicalText || 'Charaka Samhita Chikitsa Sthanam',
      description: body.description || 'Authentic herbal remedy manufactured strictly following classical Ayurvedic methodologies.',
      assured: body.assured !== undefined ? Boolean(body.assured) : true,
    };

    serverProducts = [newProduct, ...serverProducts];

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Product added successfully to catalog',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const index = serverProducts.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    serverProducts[index] = {
      ...serverProducts[index],
      ...body,
    };

    return NextResponse.json({
      success: true,
      product: serverProducts[index],
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    serverProducts = serverProducts.filter((p) => p.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted from catalog',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
