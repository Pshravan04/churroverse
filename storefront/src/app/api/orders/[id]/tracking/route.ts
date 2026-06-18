import { NextRequest, NextResponse } from 'next/server';
import { getTrackingEvents } from '@/lib/tracking';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const events = await getTrackingEvents(id);
    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch tracking' }, { status: 500 });
  }
}
