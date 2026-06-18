import { NextRequest, NextResponse } from 'next/server';
import { getProductReviews, createReview, getUserReview } from '@/lib/reviews';
import { awardPoints } from '@/lib/rewards';

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId');
  const userId = req.nextUrl.searchParams.get('userId');

  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

  if (userId) {
    const review = await getUserReview(productId, userId);
    return NextResponse.json({ review });
  }

  const reviews = await getProductReviews(productId);
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const review = await createReview(body);

    await awardPoints(body.user_id, 'review', 50, review.id);

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
