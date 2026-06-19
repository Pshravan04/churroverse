import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Supabase env vars missing' }, { status: 500 });
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/products?select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Supabase returned ${res.status}: ${await res.text()}` }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ products: data ?? [] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to fetch products' }, { status: 500 });
  }
}
