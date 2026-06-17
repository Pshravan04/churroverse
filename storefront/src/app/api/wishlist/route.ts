import { NextRequest, NextResponse } from 'next/server';
import { getWishlist, addToWishlist } from '@/lib/wishlist';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  try {
    const items = await getWishlist(userId);
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId, productId } = await req.json();
  if (!userId || !productId) {
    return NextResponse.json({ error: 'userId and productId required' }, { status: 400 });
  }

  try {
    await addToWishlist(userId, productId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}
