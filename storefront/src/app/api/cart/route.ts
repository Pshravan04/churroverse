import { NextRequest, NextResponse } from 'next/server';
import { getCart, addToCart, clearCart } from '@/lib/cart';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId    = searchParams.get('userId') ?? undefined;
  const sessionId = searchParams.get('sessionId') ?? undefined;

  try {
    const items = await getCart(userId, sessionId);
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, sessionId, productId, quantity = 1 } = body;

  if (!productId) {
    return NextResponse.json({ error: 'productId required' }, { status: 400 });
  }

  try {
    await addToCart({ userId, sessionId, productId, quantity });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { userId, sessionId } = body;

  try {
    await clearCart(userId, sessionId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
