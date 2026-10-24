import { NextResponse } from 'next/server';
import { defaultBanners, HeroBanner } from '../../../data/ayurvedaCatalog';

let serverBanners: HeroBanner[] = [...defaultBanners];

export async function GET() {
  return NextResponse.json({
    banners: serverBanners,
    total: serverBanners.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Banner title is required' }, { status: 400 });
    }

    const newBanner: HeroBanner = {
      id: `ban-${Date.now().toString(36)}`,
      title: body.title,
      subtitle: body.subtitle || '100% Authentic Classical Herbal Medicine · AYUSH Premium Certified',
      badge: body.badge || 'PROMOTIONAL OFFER',
      btnText: body.btnText || 'Explore Formulations',
      link: body.link || '/categories',
      bgGradient: body.bgGradient || 'from-[#1e3a8a] via-[#172554] to-[#0f172a]',
      imageUrl: body.imageUrl || undefined,
      active: body.active !== undefined ? Boolean(body.active) : true,
    };

    serverBanners = [newBanner, ...serverBanners];

    return NextResponse.json({
      success: true,
      banner: newBanner,
      message: 'Banner created successfully',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
    }

    const index = serverBanners.findIndex((b) => b.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    serverBanners[index] = {
      ...serverBanners[index],
      ...body,
    };

    return NextResponse.json({
      success: true,
      banner: serverBanners[index],
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
    }

    serverBanners = serverBanners.filter((b) => b.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Banner removed',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
