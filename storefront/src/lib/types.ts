// ============================================================
// Shared TypeScript types for CHURROVERSE e-commerce
// ============================================================

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_desc: string | null;
  price: number;          // in paise (₹ * 100)
  compare_price: number | null;
  category: string;
  emoji: string;
  stock: number;
  rating: number;
  review_count: number;
  tag: string | null;
  featured: boolean;
  images: string[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  quantity: number;
  created_at: string;
  product: Product;      // joined
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product;      // joined
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;       // paise
  shipping: number;       // paise
  total: number;          // paise
  shipping_address: ShippingAddress;
  payment_id: string | null;
  razorpay_order_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_emoji: string;
  quantity: number;
  price_at_purchase: number;  // paise
  created_at: string;
}

// ── Cart store state ─────────────────────────────────────────
export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isSyncing: boolean;
}

// ── Checkout form ────────────────────────────────────────────
export interface CheckoutFormData extends ShippingAddress {
  email: string;
}

// ── Helpers ──────────────────────────────────────────────────

/** Convert paise to rupees string e.g. 24900 → "249" */
export function paiseToRupees(paise: number): number {
  return Math.floor(paise / 100);
}

/** Format rupees with ₹ symbol */
export function formatPrice(paise: number): string {
  return `₹${paiseToRupees(paise).toLocaleString('en-IN')}`;
}

/** Generate an order number like CV-2026-8892 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CV-${year}-${rand}`;
}

export type ProductCategory =
  | 'all'
  | 'classic'
  | 'chocolate'
  | 'biscoff'
  | 'nutella'
  | 'strawberry'
  | 'special';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';
