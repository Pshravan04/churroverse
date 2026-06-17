import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product } from '@/lib/types';
import {
  getCart,
  addToCart as dbAddToCart,
  updateCartItemQty,
  removeFromCart as dbRemoveFromCart,
  clearCart as dbClearCart,
} from '@/lib/cart';

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isSyncing: boolean;
  sessionId: string;

  // Computed
  totalItems: () => number;
  totalPrice: () => number;

  // Actions
  syncFromDB: (userId: string) => Promise<void>;
  addItem: (product: Product, qty?: number, userId?: string | null) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  clearCart: (userId?: string | null) => Promise<void>;

  // Optimistic local-only actions (for guests before DB sync)
  addItemLocal: (product: Product, qty?: number) => void;
  removeItemLocal: (itemId: string) => void;
  updateQtyLocal: (itemId: string, qty: number) => void;
}

// Generate a stable session ID for guest carts
function generateSessionId(): string {
  return `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSyncing: false,
      sessionId: generateSessionId(),

      // ── Computed ────────────────────────────────────────────
      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),

      // ── Sync from DB (called on login) ──────────────────────
      syncFromDB: async (userId: string) => {
        set({ isLoading: true });
        try {
          const items = await getCart(userId);
          set({ items, isLoading: false });
        } catch (err) {
          console.error('[Cart] syncFromDB failed:', err);
          set({ isLoading: false });
        }
      },

      // ── Add item (DB + optimistic) ───────────────────────────
      addItem: async (product, qty = 1, userId) => {
        const { items, sessionId } = get();

        // Optimistic update
        const existing = items.find((i) => i.product_id === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.product_id === product.id
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          });
        } else {
          const tempItem: CartItem = {
            id: `temp_${product.id}`,
            user_id: userId ?? null,
            session_id: userId ? null : sessionId,
            product_id: product.id,
            quantity: qty,
            created_at: new Date().toISOString(),
            product,
          };
          set({ items: [...items, tempItem] });
        }

        // DB sync
        try {
          set({ isSyncing: true });
          await dbAddToCart({
            userId,
            sessionId: userId ? null : sessionId,
            productId: product.id,
            quantity: qty,
          });
          // Refresh from DB to get real IDs
          if (userId) {
            const fresh = await getCart(userId);
            set({ items: fresh });
          }
        } catch (err) {
          console.error('[Cart] addItem DB sync failed:', err);
        } finally {
          set({ isSyncing: false });
        }
      },

      // ── Remove item ─────────────────────────────────────────
      removeItem: async (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
        try {
          await dbRemoveFromCart(itemId);
        } catch (err) {
          console.error('[Cart] removeItem failed:', err);
        }
      },

      // ── Update quantity ──────────────────────────────────────
      updateQty: async (itemId, qty) => {
        if (qty <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity: qty } : i
          ),
        });
        try {
          await updateCartItemQty(itemId, qty);
        } catch (err) {
          console.error('[Cart] updateQty failed:', err);
        }
      },

      // ── Clear cart ───────────────────────────────────────────
      clearCart: async (userId) => {
        set({ items: [] });
        try {
          await dbClearCart(userId, userId ? null : get().sessionId);
        } catch (err) {
          console.error('[Cart] clearCart failed:', err);
        }
      },

      // ── Local-only optimistic (guests) ───────────────────────
      addItemLocal: (product, qty = 1) => {
        const { items, sessionId } = get();
        const existing = items.find((i) => i.product_id === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.product_id === product.id
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: `local_${product.id}`,
                user_id: null,
                session_id: sessionId,
                product_id: product.id,
                quantity: qty,
                created_at: new Date().toISOString(),
                product,
              },
            ],
          });
        }
      },

      removeItemLocal: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQtyLocal: (itemId, qty) => {
        if (qty <= 0) {
          get().removeItemLocal(itemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity: qty } : i
          ),
        });
      },
    }),
    {
      name: 'churroverse-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        sessionId: state.sessionId,
      }),
    }
  )
);
