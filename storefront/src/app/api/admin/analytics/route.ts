import { NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/admin';

export async function GET() {
  try {
    const analytics = await getAnalytics();
    return NextResponse.json({ analytics });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
