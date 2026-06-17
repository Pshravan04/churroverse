import { supabase } from './supabase';
import type { Order, OrderItem, ShippingAddress, CartItem, generateOrderNumber } from './types';
import { generateOrderNumber as genNum } from './types';

// ── Create a new order ───────────────────────────────────────
export async function createOrder({
  userId,
  cartItems,
  shippingAddress,
  razorpayOrderId,
  paymentId,
}: {
  userId: string;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  razorpayOrderId?: string;
  paymentId?: string;
}): Promise<Order> {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 50000 ? 0 : 4900; // Free shipping over ₹500
  const total = subtotal + shipping;
  const orderNumber = genNum();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: userId,
      status: paymentId ? 'paid' : 'pending',
      subtotal,
      shipping,
      total,
      shipping_address: shippingAddress,
      razorpay_order_id: razorpayOrderId ?? null,
      payment_id: paymentId ?? null,
    })
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

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

  if (itemsError) throw new Error(itemsError.message);

  return order as Order;
}

// ── Mark order as paid ───────────────────────────────────────
export async function markOrderPaid(
  orderId: string,
  paymentId: string
): Promise<void> {
  await supabase
    .from('orders')
    .update({ status: 'paid', payment_id: paymentId, updated_at: new Date().toISOString() })
    .eq('id', orderId);
}

// ── Get orders for a user ────────────────────────────────────
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}

// ── Get a single order by ID ─────────────────────────────────
export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('id', orderId)
    .single();

  if (error) return null;
  return data as Order;
}

// ── Get order by order_number ────────────────────────────────
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('order_number', orderNumber)
    .single();

  if (error) return null;
  return data as Order;
}
