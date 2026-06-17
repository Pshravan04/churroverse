"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Zap } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/types";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  const shipping = totalPrice >= 50000 ? 0 : 4900;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12">
          <p className="text-orange-400 font-mono text-sm uppercase tracking-widest mb-2">— Launch Manifest —</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">Your Cart</h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-7xl mb-6">🛸</div>
            <h2 className="text-2xl font-bold text-white mb-3">Empty Cargo Bay</h2>
            <p className="text-gray-500 mb-8">Your manifest is clear. Time to load some churros.</p>
            <Link href="/products">
              <Button className="bg-orange-600 hover:bg-orange-500 rounded-full px-8">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Browse the Fleet
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="flex items-center gap-4 p-5 border border-white/10 rounded-2xl bg-white/5 hover:border-orange-500/20 transition-colors"
                  >
                    {/* Product visual */}
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center flex-shrink-0 border border-white/10">
                      <span className="text-3xl">{item.product.emoji}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{item.product.name}</h3>
                      <p className="text-orange-400 font-mono font-bold">{formatPrice(item.product.price)}</p>
                    </div>

                    {/* Qty control */}
                    <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-full px-3 py-1">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item total */}
                    <p className="text-white font-black text-lg w-20 text-right">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-600 hover:text-red-500 transition-colors ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link href="/products" className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors mt-4 group">
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Continue browsing the fleet
              </Link>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-white/10 rounded-3xl bg-white/5 p-6 h-fit sticky top-24"
            >
              <h2 className="text-xl font-black text-white mb-6">Mission Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Galactic Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : ""}>
                    {shipping === 0 ? "Free 🎉" : formatPrice(shipping)}
                  </span>
                </div>
                {totalPrice >= 50000 && (
                  <p className="text-xs text-green-400 font-mono">✓ Free shipping unlocked!</p>
                )}
                {totalPrice > 0 && totalPrice < 50000 && (
                  <p className="text-xs text-gray-600">
                    Add {formatPrice(50000 - totalPrice)} more for free shipping
                  </p>
                )}
                <div className="border-t border-white/10 pt-3 flex justify-between text-white font-black text-lg">
                  <span>Total</span>
                  <span className="text-orange-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Promo code */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Promo code..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <Button size="sm" variant="outline" className="rounded-full border-white/20 text-gray-400 hover:text-white">
                  Apply
                </Button>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-full py-4 font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_35px_rgba(234,88,12,0.7)] transition-all group">
                  <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Initiate Checkout
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <p className="text-xs text-gray-600 text-center mt-4">
                Secure checkout powered by Razorpay
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
