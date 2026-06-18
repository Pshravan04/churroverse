import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { addTrackingEvent } from '@/lib/tracking';
import { getOrderById } from '@/lib/orders';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const order = await getOrderById(id);

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.status !== 'pending' && order.status !== 'paid') {
      return NextResponse.json({ error: 'Order cannot be cancelled' }, { status: 400 });
    }

    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(error.message);

    await addTrackingEvent({ order_id: id, status: 'cancelled', note: body.reason ?? 'Cancelled by customer' });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
