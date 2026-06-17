import { NextRequest, NextResponse } from 'next/server';
import { updateCartItemQty, removeFromCart } from '@/lib/cart';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;
  const body = await req.json();
  const { quantity } = body;

  if (typeof quantity !== 'number') {
    return NextResponse.json({ error: 'quantity required' }, { status: 400 });
  }

  try {
    await updateCartItemQty(itemId, quantity);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;
  try {
    await removeFromCart(itemId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}
