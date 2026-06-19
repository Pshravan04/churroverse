import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') ?? 'all';
    const search = url.searchParams.get('search') ?? undefined;
    const sort = url.searchParams.get('sort') ?? 'featured';

    const { getProducts } = await import('@/lib/products');

    const products = await getProducts({ category, search, sort } as any);
    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to fetch products' }, { status: 500 });
  }
}
