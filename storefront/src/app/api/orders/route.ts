import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByUser } from '@/lib/orders';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const orders = await getOrdersByUser(userId);
    return NextResponse.json({ orders });
  } catch (err) {
    console.error('[API] GET /api/orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
