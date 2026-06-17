import { NextResponse } from 'next/server';
import { getUniqueUserIds, getAllOrders } from '@/lib/admin';

export async function GET() {
  try {
    const userIds = await getUniqueUserIds();
    const orders = await getAllOrders();

    const users = userIds.map((userId) => {
      const userOrders = orders.filter((o) => o.user_id === userId);
      return {
        id: userId,
        orderCount: userOrders.length,
        totalSpent: userOrders.reduce((s, o) => s + o.total, 0),
        lastOrder: userOrders[0]?.created_at ?? null,
      };
    });

    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
