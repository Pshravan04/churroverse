import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { CartItem, Order } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { orderData, cartItems } = await req.json() as {
      orderData: Partial<Order>;
      cartItems: CartItem[];
    };

    if (!orderData.user_id || !cartItems?.length) {
      return NextResponse.json(
        { error: 'userId and cartItems required' },
        { status: 400 }
      );
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderData.order_number,
        user_id: orderData.user_id,
        status: 'pending',
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        total: orderData.total,
        shipping_address: orderData.shipping_address,
        razorpay_order_id: orderData.razorpay_order_id ?? null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('[create-supabase-order] Order insert error:', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Insert order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product.name,
      product_emoji: item.product.emoji,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('[create-supabase-order] Items insert error:', itemsError);
      // Don't fail — order already created
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    console.error('[create-supabase-order] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to create order';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
