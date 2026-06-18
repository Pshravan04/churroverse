import { NextRequest, NextResponse } from 'next/server';
import { getAddresses, createAddress } from '@/lib/addresses';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
  const addresses = await getAddresses(userId);
  return NextResponse.json({ addresses });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const address = await createAddress(body);
    return NextResponse.json({ address }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
