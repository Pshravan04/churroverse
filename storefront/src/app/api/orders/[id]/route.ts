import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/admin';
import { addTrackingEvent } from '@/lib/tracking';
import { getOrderById } from '@/lib/orders';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
