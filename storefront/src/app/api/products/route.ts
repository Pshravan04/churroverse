import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    return NextResponse.json({ data, error: error?.message ?? null });
  } catch (err: any) {
    return NextResponse.json({ fatal: err?.message ?? 'unknown error', stack: err?.stack ?? '' }, { status: 500 });
  }
}
