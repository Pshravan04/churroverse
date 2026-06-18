import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/admin';
import { addTrackingEvent } from '@/lib/tracking';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await updateOrderStatus(id, body.status);
    await addTrackingEvent({ order_id: id, status: body.status, note: body.note ?? '' });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
