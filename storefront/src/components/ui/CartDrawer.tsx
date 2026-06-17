"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Zap } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { userId } = useAuth();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  const shipping = totalPrice >= 50000 ? 0 : 4900;
  const grandTotal = totalPrice + shipping;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0820] border-l border-white/10 z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-orange-400" />
                <h2 className="text-xl font-black text-white">
                  Launch Manifest
                </h2>
                {totalItems > 0 && (
                  <span className="bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="text-6xl mb-4">🛸</div>
                  <p className="text-gray-400 mb-2 font-medium">Empty Cargo Bay</p>
                  <p className="text-gray-600 text-sm">Add some churros to your manifest!</p>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="inline-flex items-center justify-center mt-6 bg-orange-600 hover:bg-orange-500 text-white rounded-full px-5 py-2.5 text-sm font-bold transition-all"
                  >
                    Browse Fleet
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex items-center gap-3 p-3 border border-white/10 rounded-xl bg-white/5"
                    >
                      {/* Emoji visual */}
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center flex-shrink-0 border border-white/10 text-2xl">
                        {item.product.emoji}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">
                          {item.product.name}
                        </p>
                        <p className="text-orange-400 font-bold text-sm">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded-full px-2 py-1 flex-shrink-0">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white font-bold text-xs w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer summary + CTA */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-5 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Galactic Shipping</span>
                    <span className={shipping === 0 ? "text-green-400" : ""}>
                      {shipping === 0 ? "Free 🎉" : formatPrice(shipping)}
                    </span>
                  </div>
                  {totalPrice < 50000 && (
                    <p className="text-xs text-gray-600">
                      Add {formatPrice(50000 - totalPrice)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-white/10 pt-2 flex justify-between font-black text-white text-base">
                    <span>Total</span>
                    <span className="text-orange-400">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={onClose}>
                  <Button className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-full py-4 font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_35px_rgba(234,88,12,0.7)] transition-all group">
                    <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                    Initiate Checkout
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/cart" onClick={onClose} className="block text-center text-xs text-gray-500 hover:text-white transition-colors">
                  View full manifest →
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
