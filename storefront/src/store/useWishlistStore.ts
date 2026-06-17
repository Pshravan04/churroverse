import { create } from 'zustand';
import type { WishlistItem } from '@/lib/types';
import {
  getWishlist,
  addToWishlist as dbAdd,
  removeFromWishlist as dbRemove,
  getWishlistProductIds,
} from '@/lib/wishlist';

interface WishlistStore {
  items: WishlistItem[];
  productIds: Set<string>;     // for O(1) lookup
  isLoading: boolean;

  // Actions
  syncFromDB: (userId: string) => Promise<void>;
  toggle: (userId: string, product: WishlistItem['product']) => Promise<boolean>;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  productIds: new Set(),
  isLoading: false,

  // Load wishlist from Supabase
  syncFromDB: async (userId: string) => {
    set({ isLoading: true });
    try {
      const [items, ids] = await Promise.all([
        getWishlist(userId),
        getWishlistProductIds(userId),
      ]);
      set({ items, productIds: new Set(ids), isLoading: false });
    } catch (err) {
      console.error('[Wishlist] syncFromDB failed:', err);
      set({ isLoading: false });
    }
  },

  // Toggle item in wishlist
  toggle: async (userId, product) => {
    const { productIds, items } = get();
    const isIn = productIds.has(product.id);

    if (isIn) {
      // Optimistic remove
      const newIds = new Set(productIds);
      newIds.delete(product.id);
      set({
        productIds: newIds,
        items: items.filter((i) => i.product_id !== product.id),
      });
      await dbRemove(userId, product.id);
      return false;
    } else {
      // Optimistic add
      const newIds = new Set(productIds);
      newIds.add(product.id);
      const tempItem: WishlistItem = {
        id: `temp_${product.id}`,
        user_id: userId,
        product_id: product.id,
        created_at: new Date().toISOString(),
        product,
      };
      set({ productIds: newIds, items: [tempItem, ...items] });
      await dbAdd(userId, product.id);
      return true;
    }
  },

  isWishlisted: (productId: string) => get().productIds.has(productId),
}));
