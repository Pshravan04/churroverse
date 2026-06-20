"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Heart, ArrowLeft, Zap, Shield, Truck, StarHalf, MessageSquare, X } from "lucide-react";
import { use } from "react";
import { useUser } from "@clerk/nextjs";
import AddToCartButton from "@/components/ui/AddToCartButton";
import WishlistButton from "@/components/ui/WishlistButton";
import type { Product, Review } from "@/lib/types";
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

              {/* Main product visual */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-64 h-64 flex items-center justify-center"
              >
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                  />
                ) : (
                  <span className="text-[8rem]">{product.emoji}</span>
                )}
              </motion.div>

              {/* Category badge */}
              <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-xs text-orange-400 font-mono">
                {product.category}
              </div>
            </div>

            {/* Thumbnail row */}
            <div className="flex gap-3 mt-4">
              {["Front", "Cross-Section", "Plated"].map((view, idx) => (
                <div key={view} className="flex-1 aspect-square rounded-xl border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:border-orange-500/50 transition-colors">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={`${product.name} ${view}`}
                      className="w-12 h-12 object-contain filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]"
                    />
                  ) : (
                    <span className="text-2xl">{product.emoji}</span>
                  )}
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

      <ReviewSection productId={product.id} />
    </div>
  );
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${cls} ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
      ))}
    </div>
  );
}

function ReviewSection({ productId }: { productId: string }) {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const u = user?.id ? `&userId=${user.id}` : "";
    fetch(`/api/reviews?productId=${productId}${u}`)
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews ?? []);
        setMyReview(d.review ?? null);
        setLoading(false);
      });
  }, [productId, user?.id]);

  const submitReview = async () => {
    if (!user?.id) return;
    setSaving(true);
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, user_id: user.id, ...form }),
    });
    setSaving(false);
    setShowForm(false);
    const r = await fetch(`/api/reviews?productId=${productId}&userId=${user.id}`).then((x) => x.json());
    setReviews(r.reviews ?? []);
    setMyReview(r.review ?? null);
  };

  const avg = reviews.length > 0 ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 : 0;

  return (
    <div className="max-w-4xl mx-auto mt-16 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-400" /> Reviews
          </h2>
          {reviews.length > 0 && (
            <p className="text-sm text-gray-400 mt-1">{avg} avg · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          )}
        </div>
        {user && !myReview && !showForm && (
          <button onClick={() => setShowForm(true)} className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
            Write a Review
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 text-gray-500 rounded-xl border border-white/5 bg-[#0a0a12]/50"
        >
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No reviews yet. Be the first!</p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {reviews.map((r) => (
            <motion.div
              key={r.id}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="rounded-xl border border-white/5 bg-[#0a0a12]/80 backdrop-blur-sm p-4 hover:border-white/10 transition-all hover:bg-[#0a0a12]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StarRating rating={r.rating} />
                    {r.title && <span className="text-white text-sm font-semibold truncate">{r.title}</span>}
                  </div>
                  {r.text && <p className="text-gray-400 text-sm mt-2 leading-relaxed">{r.text}</p>}
                  <p className="text-gray-600 text-xs mt-3 font-mono">
                    {new Date(r.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
            className="relative bg-[#0a0a12] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6"
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Write a Review</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setForm({ ...form, rating: s })}
                    >
                      <Star className={`w-7 h-7 transition-all ${s <= form.rating ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.3)]" : "text-gray-600 hover:text-gray-500"}`} />
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5 uppercase tracking-wider">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Optional headline"
                  className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5 uppercase tracking-wider">Review</label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-gray-500 hover:text-white transition-colors rounded-xl hover:bg-white/[0.04]">
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)]"
              >
                {saving ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
