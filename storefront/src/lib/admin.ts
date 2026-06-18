import { supabase } from './supabase';
import type { Order, Product } from './types';

// ── Discount Code ─────────────────────────────────────────────
export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_cart_value: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  description: string | null;
  created_at: string;
}

// ── Reward ────────────────────────────────────────────────────
export interface Reward {
  id: string;
  user_id: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  total_spent: number;
  created_at: string;
  updated_at: string;
}

// ── Analytics ─────────────────────────────────────────────────
export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  averageOrderValue: number;
  revenueByDay: { date: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: (Product & { total_sold: number })[];
}

// ── Discounts ─────────────────────────────────────────────────
export async function getDiscounts(): Promise<DiscountCode[]> {
  const { data } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as DiscountCode[];
}

export async function createDiscount(input: Partial<DiscountCode>) {
  const { data, error } = await supabase
    .from('discount_codes')
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as DiscountCode;
}

export async function updateDiscount(id: string, input: Partial<DiscountCode>) {
  const { data, error } = await supabase
    .from('discount_codes')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as DiscountCode;
}

export async function deleteDiscount(id: string) {
  const { error } = await supabase
    .from('discount_codes')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Rewards ───────────────────────────────────────────────────
export async function getRewards(): Promise<Reward[]> {
  const { data } = await supabase
    .from('rewards')
    .select('*')
    .order('total_spent', { ascending: false });
  return (data ?? []) as Reward[];
}

export async function upsertReward(input: Partial<Reward>) {
  const { data, error } = await supabase
    .from('rewards')
    .upsert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Reward;
}

// ── All Orders (admin) ────────────────────────────────────────
export async function getAllOrders(): Promise<Order[]> {
  const { data } = await supabase
    .from('orders')
    .select(`*, items:order_items(*)`)
    .order('created_at', { ascending: false });
  return (data ?? []) as Order[];
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ── All Products (admin) ──────────────────────────────────────
export async function getAllProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as Product[];
}

export async function createProduct(input: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Product;
}

export async function updateProduct(id: string, input: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Product;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Unique Users from orders ──────────────────────────────────
export async function getUniqueUserIds(): Promise<string[]> {
  const { data } = await supabase
    .from('orders')
    .select('user_id')
    .order('created_at', { ascending: false });
  const unique = [...new Set((data ?? []).map((o) => o.user_id))];
  return unique;
}

// ── Analytics (runs in-database via RPC) ──────────────────────
export async function getAnalytics(): Promise<Analytics> {
  const { data, error } = await supabase.rpc('get_admin_analytics');

  if (error) {
    console.error('[admin] RPC error, falling back to JS aggregation:', error.message);
    return getAnalyticsFallback();
  }

  return data as Analytics;
}

/** Fallback JS-side aggregation if RPC is unavailable */
async function getAnalyticsFallback(): Promise<Analytics> {
  const [orders, products, orderItems] = await Promise.all([
    supabase.from('orders').select('total, status, created_at, user_id'),
    supabase.from('products').select('id, name, emoji, price, slug, description, long_desc, compare_price, category, stock, rating, review_count, tag, featured, images, metadata, created_at'),
    supabase.from('order_items').select('product_id, quantity'),
  ]);

  const allOrders = (orders.data ?? []) as Order[];
  const allProducts = (products.data ?? []) as Product[];
  const allItems = (orderItems.data ?? []) as { product_id: string; quantity: number }[];

  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);
  const totalUsers = [...new Set(allOrders.map((o) => o.user_id))].length;
  const avg = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const dayMap: Record<string, number> = {};
  for (const o of allOrders) {
    const day = o.created_at?.split('T')[0];
    if (day) dayMap[day] = (dayMap[day] ?? 0) + o.total;
  }
  const revenueByDay = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, revenue]) => ({ date, revenue }));

  const statusMap: Record<string, number> = {};
  for (const o of allOrders) statusMap[o.status] = (statusMap[o.status] ?? 0) + 1;
  const ordersByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

  const soldMap: Record<string, number> = {};
  for (const item of allItems) soldMap[item.product_id] = (soldMap[item.product_id] ?? 0) + item.quantity;
  const topProducts = allProducts
    .map((p) => ({ ...p, total_sold: soldMap[p.id] ?? 0 }))
    .sort((a, b) => b.total_sold - a.total_sold)
    .slice(0, 10);

  return { totalRevenue, totalOrders, totalProducts: allProducts.length, totalUsers, averageOrderValue: avg, revenueByDay, ordersByStatus, topProducts };
}
