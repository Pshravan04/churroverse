"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Heart, ArrowLeft, Zap, Shield, Truck } from "lucide-react";
import { use } from "react";
import AddToCartButton from "@/components/ui/AddToCartButton";
import WishlistButton from "@/components/ui/WishlistButton";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/types";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data.product ?? null);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
          <p className="text-gray-500 text-sm font-mono">Scanning the nebula...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛸</div>
          <h2 className="text-2xl font-bold text-white mb-3">Capsule Not Found</h2>
          <p className="text-gray-500 mb-6">This energy capsule has drifted into a wormhole.</p>
          <Link href="/products">
            <Button className="bg-orange-600 hover:bg-orange-500 rounded-full">
              Return to Fleet
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 mt-8"
        >
          <Link href="/products" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Fleet
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Product Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div
              className="aspect-square rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 to-black relative flex items-center justify-center overflow-hidden"
            >
              {/* Glow background */}
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: `radial-gradient(circle at 50% 50%, rgba(234,88,12,0.4), transparent 65%)` }}
              />

              {/* Orbital rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border border-white/10"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16 rounded-full border border-white/5"
              />

              {/* Main product emoji */}
              <motion.span
                animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="text-[8rem] relative z-10"
              >
                {product.emoji}
              </motion.span>

              {/* Category badge */}
              <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-xs text-orange-400 font-mono">
                {product.category}
              </div>
            </div>

            {/* Thumbnail row */}
            <div className="flex gap-3 mt-4">
              {["Front", "Cross-Section", "Plated"].map((view) => (
                <div key={view} className="flex-1 aspect-square rounded-xl border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:border-orange-500/50 transition-colors">
                  <span className="text-2xl">{product.emoji}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col"
          >
            {product.tag && (
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-orange-600 text-white mb-3 w-fit">
                {product.tag}
              </span>
            )}
            <p className="text-orange-400 font-mono text-sm uppercase tracking-widest mb-3">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-700"}`} />
                ))}
              </div>
              <span className="text-yellow-400 font-bold">{product.rating}</span>
              <span className="text-gray-500 text-sm">({product.review_count} reviews)</span>
            </div>

            <p className="text-4xl font-black text-orange-400 mb-6">{formatPrice(product.price)}</p>
            {product.compare_price && (
              <p className="text-lg text-gray-500 line-through -mt-5 mb-6">
                {formatPrice(product.compare_price)}
              </p>
            )}

            <p className="text-gray-300 leading-relaxed mb-8">{product.long_desc || product.description}</p>

            {/* Additional details from metadata */}
            {product.metadata && Object.keys(product.metadata).length > 0 && (
              <div className="space-y-3 mb-8 border border-white/10 rounded-2xl p-5 bg-white/5">
                {Object.entries(product.metadata as Record<string, string>).map(([key, val]) => (
                  <div key={key} className="flex gap-4">
                    <span className="text-gray-500 text-sm w-28 flex-shrink-0 capitalize">{key.replace(/_/g, " ")}:</span>
                    <span className="text-gray-300 text-sm">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex gap-3 mb-8">
              <AddToCartButton product={product} size="lg" className="flex-1" />
              <WishlistButton product={product} size="md" />
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck, label: "Express Delivery", sub: "24-48 hours" },
                { icon: Shield, label: "Freshness Sealed", sub: "72hr guarantee" },
                { icon: ShoppingBag, label: "Easy Returns", sub: "No questions" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon className="w-5 h-5 text-orange-500 mb-1" />
                  <p className="text-xs font-bold text-gray-300">{label}</p>
                  <p className="text-xs text-gray-600">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
