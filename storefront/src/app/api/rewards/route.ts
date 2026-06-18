import { NextRequest, NextResponse } from 'next/server';
import { getReward, getTransactions } from '@/lib/rewards';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const [reward, transactions] = await Promise.all([
    getReward(userId),
    getTransactions(userId),
  ]);

  return NextResponse.json({ reward, transactions });
}
