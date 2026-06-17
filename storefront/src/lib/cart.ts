import { supabase } from './supabase';
import type { CartItem } from './types';

// ── Fetch cart (user or session) ─────────────────────────────
export async function getCart(
  userId?: string | null,
  sessionId?: string | null
): Promise<CartItem[]> {
  if (!userId && !sessionId) return [];

  let query = supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*)
    `);

  if (userId) {
    query = query.eq('user_id', userId);
  } else if (sessionId) {
    query = query.eq('session_id', sessionId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as CartItem[];
}

// ── Add or update cart item ───────────────────────────────────
export async function addToCart({
  userId,
  sessionId,
  productId,
  quantity = 1,
}: {
  userId?: string | null;
  sessionId?: string | null;
  productId: string;
  quantity?: number;
}): Promise<void> {
  const identifier = userId
    ? { user_id: userId }
    : { session_id: sessionId };

  // Check if already in cart
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .match({ product_id: productId, ...identifier })
    .maybeSingle();

  if (existing) {
    // Update quantity
    await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);
  } else {
    // Insert new
    await supabase
      .from('cart_items')
      .insert({ product_id: productId, quantity, ...identifier });
  }
}

// ── Update cart item quantity ─────────────────────────────────
export async function updateCartItemQty(
  itemId: string,
  quantity: number
): Promise<void> {
  if (quantity <= 0) {
    await removeFromCart(itemId);
    return;
  }
  await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId);
}

// ── Remove a single item ──────────────────────────────────────
export async function removeFromCart(itemId: string): Promise<void> {
  await supabase.from('cart_items').delete().eq('id', itemId);
}

// ── Clear entire cart for a user ─────────────────────────────
export async function clearCart(
  userId?: string | null,
  sessionId?: string | null
): Promise<void> {
  if (userId) {
    await supabase.from('cart_items').delete().eq('user_id', userId);
  } else if (sessionId) {
    await supabase.from('cart_items').delete().eq('session_id', sessionId);
  }
}

// ── Merge guest cart into user cart on login ──────────────────
export async function mergeGuestCart(
  sessionId: string,
  userId: string
): Promise<void> {
  const { data: guestItems } = await supabase
    .from('cart_items')
    .select('product_id, quantity')
    .eq('session_id', sessionId);

  if (!guestItems?.length) return;

  for (const item of guestItems) {
    await addToCart({ userId, productId: item.product_id, quantity: item.quantity });
  }

  // Clear guest cart
  await clearCart(null, sessionId);
}
