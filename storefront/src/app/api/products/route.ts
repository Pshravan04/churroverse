import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';
import type { ProductCategory, SortOption } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = (searchParams.get('category') ?? 'all') as ProductCategory;
  const search   = searchParams.get('search') ?? undefined;
  const sort     = (searchParams.get('sort') ?? 'featured') as SortOption;

  try {
    const products = await getProducts({ category, search, sort });
    return NextResponse.json({ products });
  } catch (err) {
    console.error('[API] GET /api/products error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
