import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') ?? 'all';
    const search = url.searchParams.get('search') ?? undefined;
    const sort = url.searchParams.get('sort') ?? 'featured';

    let query = supabase.from('products').select('*');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (sort === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else if (sort === 'rating') {
      query = query.order('rating', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: (data ?? []) as Product[] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to fetch products' }, { status: 500 });
  }
}
