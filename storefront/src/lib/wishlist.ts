import { supabase } from './supabase';
import type { WishlistItem } from './types';

// ── Get wishlist for user ─────────────────────────────────────
export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as WishlistItem[];
}

// ── Add to wishlist ───────────────────────────────────────────
export async function addToWishlist(
  userId: string,
  productId: string
): Promise<void> {
  await supabase
    .from('wishlists')
    .upsert({ user_id: userId, product_id: productId });
}

// ── Remove from wishlist ──────────────────────────────────────
export async function removeFromWishlist(
  userId: string,
  productId: string
): Promise<void> {
  await supabase
    .from('wishlists')
    .delete()
    .match({ user_id: userId, product_id: productId });
}

// ── Toggle wishlist ───────────────────────────────────────────
export async function toggleWishlist(
  userId: string,
  productId: string
): Promise<boolean> {
  const alreadyIn = await isInWishlist(userId, productId);
  if (alreadyIn) {
    await removeFromWishlist(userId, productId);
    return false;
  } else {
    await addToWishlist(userId, productId);
    return true;
  }
}

// ── Check if item is in wishlist ──────────────────────────────
export async function isInWishlist(
  userId: string,
  productId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('wishlists')
    .select('id')
    .match({ user_id: userId, product_id: productId })
    .maybeSingle();

  return !!data;
}

// ── Get wishlist product IDs for quick lookup ─────────────────
export async function getWishlistProductIds(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', userId);

  return (data ?? []).map((row) => row.product_id);
}
