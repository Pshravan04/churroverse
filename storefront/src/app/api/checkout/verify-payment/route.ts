import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { markOrderPaid } from '@/lib/orders';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      our_order_id,       // our Supabase order ID
    } = await req.json();

    // Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed. Invalid signature.' },
        { status: 400 }
      );
    }

    // Mark order as paid in Supabase
    if (our_order_id) {
      await markOrderPaid(our_order_id, razorpay_payment_id);
    }

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err: unknown) {
    console.error('[Razorpay] verify-payment error:', err);
    const msg = err instanceof Error ? err.message : 'Verification failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
