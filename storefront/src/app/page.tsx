"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Star, Zap, Shield, ChevronDown, Rocket, ArrowRight,
  Sparkles, Clock, Truck, Award, Heart, ShoppingCart, Plus, Minus, Flame, Cookie, Snowflake,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/types";

// ── Animation ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

// ── Category config (matches actual menu) ─────────────────────
const CATEGORIES = [
  { key: "churro", label: "Churro Planet", emoji: "🌀", desc: "Classic galactic churros — cinnamon-dusted, caramel-filled, every bite a supernova.", gradient: "from-orange-900/40 to-amber-900/20", glow: "rgba(234,88,12,0.3)" },
  { key: "shake", label: "Nebula Drinks", emoji: "🥤", desc: "Thick, creamy milkshakes infused with cosmic flavors from across the universe.", gradient: "from-pink-900/40 to-purple-900/20", glow: "rgba(236,72,153,0.3)" },
  { key: "iced-tea", label: "Iced Tea Nebula", emoji: "🧊", desc: "Refreshing iced teas brewed from rare leaves found on distant moons.", gradient: "from-amber-900/40 to-yellow-900/20", glow: "rgba(245,158,11,0.3)" },
  { key: "waffle", label: "Waffle Planet", emoji: "🧇", desc: "Golden waffles with crispy constellations and sweet meteor showers.", gradient: "from-yellow-900/40 to-orange-900/20", glow: "rgba(251,191,36,0.3)" },
  { key: "munchies", label: "Munchies Planet", emoji: "🍟", desc: "Savory cosmic snacks — perfect co-pilots for your flavor expedition.", gradient: "from-red-900/40 to-orange-900/20", glow: "rgba(220,38,38,0.3)" },
];

const FEATURES = [
  { icon: Sparkles, title: "Freshly Made", desc: "Every churro is hand-crafted to order. Zero pre-packaged, all space-grade quality." },
  { icon: Heart, title: "Cosmic Variety", desc: "From dark matter chocolate to nebula berry — 12 signature flavors across 5 galaxies." },
  { icon: Truck, title: "Warp Delivery", desc: "Flash-frozen at source, delivered across the galaxy within 24 light-hours." },
  { icon: Award, title: "Satisfaction Guaranteed", desc: "If your churro doesn't blow your mind, we'll send a replacement — no questions asked." },
];

const MOCK_FEATURED: Product[] = [
  { id: "m1", slug: "cosmic-churro", name: "Cosmic Churro Classic", description: "Cinnamon-dusted spirals, caramel-filled, lightly crispy.", long_desc: null, price: 24900, compare_price: null, category: "churro", emoji: "🌀", stock: 50, rating: 4.8, review_count: 312, tag: "Best Seller", featured: true, images: [], metadata: {}, created_at: "" },
  { id: "m2", slug: "dark-matter", name: "Dark Matter Chocolate", description: "Rich 70% dark chocolate ganache fused into every bite.", long_desc: null, price: 29900, compare_price: 34900, category: "churro", emoji: "🍫", stock: 40, rating: 4.9, review_count: 218, tag: "New Arrival", featured: true, images: [], metadata: {}, created_at: "" },
  { id: "m3", slug: "stardust-biscoff", name: "Stardust Biscoff", description: "Belgian Biscoff cream swirled through crunchy dough.", long_desc: null, price: 27900, compare_price: null, category: "churro", emoji: "⭐", stock: 35, rating: 4.7, review_count: 156, tag: "Fan Favorite", featured: true, images: [], metadata: {}, created_at: "" },
];

const MOCK_BESTSELLERS: Product[] = [
  { id: "m4", slug: "nebula-nutella", name: "Nebula Nutella", description: "Hazelnut cocoa spread meets warm churro dough.", long_desc: null, price: 28900, compare_price: null, category: "churro", emoji: "🌌", stock: 30, rating: 4.9, review_count: 312, tag: null, featured: false, images: [], metadata: {}, created_at: "" },
  { id: "m5", slug: "solar-strawberry", name: "Solar Strawberry", description: "Sun-ripened strawberries in a sweet glaze.", long_desc: null, price: 25900, compare_price: null, category: "churro", emoji: "🌟", stock: 45, rating: 4.8, review_count: 218, tag: null, featured: false, images: [], metadata: {}, created_at: "" },
  { id: "m6", slug: "orion-oreo", name: "Orion Oreo Blast", description: "Crushed Oreo cookies fused into every ridge.", long_desc: null, price: 31900, compare_price: 36900, category: "churro", emoji: "🪐", stock: 25, rating: 5.0, review_count: 156, tag: null, featured: false, images: [], metadata: {}, created_at: "" },
  { id: "m7", slug: "galaxy-caramel", name: "Galaxy Caramel", description: "House-made caramel sauce, stretched and pulled to perfection.", long_desc: null, price: 26900, compare_price: null, category: "churro", emoji: "✨", stock: 60, rating: 4.7, review_count: 445, tag: null, featured: false, images: [], metadata: {}, created_at: "" },
];

const MOCK_REVIEWS = [
  { name: "Commander Reyes", rank: "Star Admiral", rating: 5, text: "These churros defied the laws of physics. Absolutely explosive flavor." },
  { name: "Nova Kim", rank: "Galactic Explorer", rating: 5, text: "I've traveled 14 galaxies. Nothing compares to the Cosmic Classic." },
  { name: "Lt. Adaeze", rank: "Fleet Officer", rating: 5, text: "Our entire crew ordered the Dark Matter box. Zero survivors. Zero regrets." },
];

// ── Sub-components ────────────────────────────────────────────
function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${cls} ${s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-700"}`} />
      ))}
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.08}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-orange-500/30 transition-all duration-300"
    >
      {product.tag && (
        <span className="absolute top-3 left-3 z-10 text-xs font-bold px-2.5 py-1 rounded-full bg-orange-600 text-white shadow">
          {product.tag}
        </span>
      )}
      <Link href={`/products/${product.id}`}>
        <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-gray-900 to-black overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-orange-500/10 rounded-full blur-2xl group-hover:w-28 group-hover:h-28 group-hover:bg-orange-500/20 transition-all duration-500" />
          </div>
          <span className="text-5xl relative z-10">{product.emoji}</span>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors leading-tight mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-gray-600 text-xs">({product.review_count})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-orange-400">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-xs text-gray-600 line-through">{formatPrice(product.compare_price)}</span>
            )}
          </div>
          <Link href={`/products/${product.id}`}>
            <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-white group/btn">
              View <ArrowRight className="ml-1 w-3 h-3 inline group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Section components ────────────────────────────────────────
function SectionHeader({ subtitle, title, align = "center" }: { subtitle: string; title: string; align?: "center" | "left" }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`mb-12 ${align === "center" ? "text-center" : ""}`}
    >
      <p className="text-orange-400/80 font-mono text-xs uppercase tracking-[0.25em] mb-3">{subtitle}</p>
      <h2 className="text-3xl md:text-5xl font-black text-white">{title}</h2>
    </motion.div>
  );
}

const HERO_FEATURES = [
  { icon: Flame, label: "Extra Cinnamon", desc: "Cosmic-grade cinnamon dust on every ridge", color: "from-orange-500/20 to-red-500/10", border: "border-orange-500/30", iconColor: "text-orange-400" },
  { icon: Cookie, label: "Crispy & Warm", desc: "Flash-fried to golden perfection", color: "from-yellow-500/20 to-amber-500/10", border: "border-yellow-500/30", iconColor: "text-yellow-400" },
  { icon: Snowflake, label: "Caramel Filled", desc: "House-made caramel core in every bite", color: "from-amber-500/20 to-orange-500/10", border: "border-amber-500/30", iconColor: "text-amber-400" },
];

function HeroSection() {
  const [qty, setQty] = useState(1);

  return (
    <section className="relative w-full min-h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #020010 0%, #0a0520 40%, #0f0825 100%)" }}>
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-orange-600/8 blur-[180px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-700/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#020010] to-transparent" />
      </div>

      {/* Decorative dots & triangles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[["top-16 left-[8%]", "orange"], ["top-28 right-[12%]", "yellow"], ["bottom-48 left-[6%]", "red"], ["top-1/2 right-[5%]", "amber"]].map(([pos, color], i) => (
          <motion.div key={i} className={`absolute ${pos}`}
            animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "linear" }}
          >
            <div className={`w-3 h-3 border-2 border-${color}-400/50 rotate-45`} />
          </motion.div>
        ))}
        {[["top-20 right-[22%]", "w-2 h-2 bg-yellow-400"], ["top-1/3 left-[15%]", "w-1.5 h-1.5 bg-orange-400"], ["bottom-1/3 right-[18%]", "w-2 h-2 bg-pink-400"], ["top-2/3 left-[28%]", "w-1 h-1 bg-white"]].map(([pos, cls], i) => (
          <motion.div key={i} className={`absolute ${pos} ${cls} rounded-full`}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + i, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Main hero grid */}
      <div className="relative z-10 container mx-auto px-6 max-w-7xl min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_320px] gap-8 items-center pt-8 pb-12">

          {/* ── LEFT: Headline + CTA ─────────────────────────── */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
            <motion.p variants={fadeUp} custom={0}
              className="text-orange-400 font-mono text-xs uppercase tracking-[0.25em] flex items-center gap-2"
            >
              <span className="w-8 h-px bg-orange-400/60" /> Universe of Flavor
            </motion.p>

            <motion.h1 variants={fadeUp} custom={0.08}
              className="text-5xl md:text-6xl xl:text-7xl font-black uppercase leading-[0.92] tracking-tight"
            >
              <span className="text-white">EAT OUR</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 drop-shadow-[0_0_20px_rgba(255,140,0,0.5)]">COSMIC</span><br />
              <span className="text-white">CHURROS</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={0.16}
              className="text-gray-400 leading-relaxed max-w-sm text-sm"
            >
              Hand-crafted in zero gravity — cinnamon-dusted, caramel-filled, every bite a supernova of flavor across all 5 flavor galaxies.
            </motion.p>

            {/* Qty + Add to Cart */}
            <motion.div variants={fadeUp} custom={0.24} className="flex items-center gap-4 pt-2">
              <Link href="/products">
                <Button
                  className="bg-orange-600 hover:bg-orange-500 text-white rounded-full px-7 py-5 text-sm font-bold shadow-[0_0_25px_rgba(234,88,12,0.5)] hover:shadow-[0_0_45px_rgba(234,88,12,0.75)] transition-all duration-300 hover:scale-105 group flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Order Now
                </Button>
              </Link>

              <div className="flex items-center gap-0 bg-white/[0.06] border border-white/10 rounded-full overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-300 hover:bg-white/10 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-white">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-300 hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fadeUp} custom={0.32}
              className="flex items-center gap-6 pt-4 border-t border-white/10"
            >
              {[
                { value: "50K+", label: "Served" },
                { value: "12", label: "Flavors" },
                { value: "4.9★", label: "Rating" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-black text-orange-400">{value}</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── CENTER: Floating product image ───────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Glow rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full border border-orange-500/10 animate-pulse" />
              <div className="absolute w-52 h-52 rounded-full border border-orange-400/15" />
              <div className="absolute w-80 h-80 rounded-full bg-orange-600/8 blur-[60px]" />
            </div>

            {/* "Crispy & Warm Toasty" badge overlay like reference */}
            <div className="absolute left-0 bottom-[28%] z-20 flex flex-col gap-1">
              <div className="bg-orange-500 text-white font-black text-base px-5 py-2 rounded-r-full tracking-wide shadow-[0_4px_20px_rgba(234,88,12,0.6)] uppercase">Crispy &amp;</div>
              <div className="bg-gradient-to-r from-pink-600 to-red-600 text-white font-black text-base px-5 py-2 rounded-r-full tracking-wide shadow-[0_4px_20px_rgba(220,38,38,0.6)] uppercase">Warm Toasty</div>
            </div>

            <motion.div
              animate={{ y: [0, -14, 0], rotate: [-1, 1, -1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/churro-hero.png"
                alt="Cosmic Churro — Cinnamon-dusted, caramel-filled"
                className="w-[320px] md:w-[400px] xl:w-[460px] object-contain drop-shadow-[0_20px_60px_rgba(234,88,12,0.4)]"
              />
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Feature pills ─────────────────────────── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.p variants={fadeUp} className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-2">Signature Features</motion.p>
            {HERO_FEATURES.map((feat, i) => (
              <motion.div
                key={feat.label}
                variants={fadeUp}
                custom={i * 0.1}
                whileHover={{ x: 6, scale: 1.02 }}
                className={`flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br ${feat.color} border ${feat.border} backdrop-blur-sm transition-all duration-200 cursor-default`}
              >
                <div className={`w-9 h-9 rounded-full bg-black/30 flex items-center justify-center flex-shrink-0`}>
                  <feat.icon className={`w-4 h-4 ${feat.iconColor}`} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{feat.label}</p>
                  <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{feat.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Mini rating card */}
            <motion.div variants={fadeUp} custom={0.35}
              className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3"
            >
              <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
              <div>
                <p className="text-white text-xs font-bold">4.9 / 5.0</p>
                <p className="text-gray-500 text-[10px]">312 cosmic reviews</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── BESTSELLER STRIP (like reference bottom row) ───── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="relative rounded-2xl overflow-hidden mb-8"
          style={{ background: "linear-gradient(135deg, #0f2a2a 0%, #1a3a2a 50%, #0d1f1f 100%)" }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(52,211,153,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(234,88,12,0.2) 0%, transparent 60%)" }}
          />
          <div className="relative z-10 flex items-stretch divide-x divide-white/10 overflow-x-auto scrollbar-hide">
            {MOCK_BESTSELLERS.slice(0, 4).map((p, i) => (
              <Link key={p.id} href={`/products/${p.id}`}
                className="flex-1 min-w-[160px] flex flex-col items-center gap-3 p-5 hover:bg-white/5 transition-colors group"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {p.emoji}
                  </div>
                  <div className="absolute -inset-2 bg-orange-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-center">
                  <p className="text-white text-xs font-bold leading-tight">{p.name}</p>
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.round(p.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-700"}`} />)}
                  </div>
                  <p className="text-orange-400 font-black text-sm mt-1">{formatPrice(p.price)}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full uppercase tracking-wider group-hover:bg-emerald-400/20 transition-colors">
                  Order Now
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-600 z-10"
      >
        <span className="text-[10px] uppercase tracking-widest">Explore</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeaturedSection({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="w-full py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-transparent pointer-events-none" />
      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <SectionHeader subtitle="— Handcrafted in Zero Gravity —" title="Featured Flavors" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
          <motion.div variants={fadeUp} className="text-center mt-10">
            <Link href="/products">
              <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 group">
                View All Capsules <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>
      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <SectionHeader subtitle="— 5 Known Dimensions —" title="Explore the Universe" />
          <motion.p variants={fadeUp} className="text-gray-500 text-center max-w-xl mx-auto mb-12 -mt-8">
            Every flavor category is a distinct world. Pick your dimension and begin the journey.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.key} variants={fadeUp} custom={i * 0.08}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center overflow-hidden hover:border-orange-500/30 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{cat.emoji}</div>
                  <h3 className="font-bold text-white text-sm mb-2">{cat.label}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{cat.desc}</p>
                  <Link href={`/products?category=${cat.key}`}
                    className="absolute inset-0 rounded-2xl"
                    aria-label={`Explore ${cat.label}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BestsellersSection({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="w-full py-24 md:py-32 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <SectionHeader subtitle="— Mission-Critical Picks —" title="Best Sellers" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
          <motion.div variants={fadeUp} className="text-center mt-10">
            <Link href="/products?sort=rating">
              <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 group">
                View Top Rated <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/10 to-black pointer-events-none" />
      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <SectionHeader subtitle="— Why Choose Us —" title="Built for Explorers" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i * 0.1}
                whileHover={{ y: -4 }}
                className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:border-orange-500/20 hover:bg-orange-950/10 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-600/20 flex items-center justify-center mb-4 group-hover:bg-orange-600/30 transition-colors">
                  <f.icon className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="w-full py-24 md:py-32 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <SectionHeader subtitle="— Intercepted Transmissions —" title="Commander Reviews" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_REVIEWS.map((r, i) => (
              <motion.div key={i} variants={fadeUp} custom={i * 0.1}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                    <StarRating rating={r.rating} size="md" />
                <p className="text-gray-300 text-sm leading-relaxed mb-5 mt-3 italic">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">{r.name}</p>
                    <p className="text-[10px] text-blue-400/80 font-mono">{r.rank}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)" }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] rounded-full bg-green-900/20 blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-2xl text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}
            className="inline-block bg-green-950 border border-green-500/30 rounded-xl px-4 py-2 mb-8 font-mono text-green-400 text-sm"
          >
            {"> "} MISSION CONTROL UPLINK AVAILABLE
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white mb-4">
            Join The Fleet
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 mb-8">
            Get classified intelligence on new flavors, exclusive drops, and galactic discounts delivered to your comm link.
          </motion.p>

          <motion.form variants={fadeUp}
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input type="email" placeholder="commander@galaxy.space"
              className="flex-1 bg-white/5 border border-white/20 rounded-full px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors font-mono text-sm"
            />
            <Button type="submit"
              className="bg-orange-600 hover:bg-orange-500 text-white rounded-full px-8 py-4 font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_35px_rgba(234,88,12,0.7)] transition-all whitespace-nowrap"
            >
              <Zap className="w-4 h-4 mr-2" /> Engage Uplink
            </Button>
          </motion.form>

          <motion.p variants={fadeUp} className="text-xs text-gray-600 mt-4 flex items-center justify-center gap-2">
            <Shield className="w-3 h-3" />
            No spam transmissions. Unsubscribe anytime from any galaxy.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="w-full border-t border-white/10 py-12 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black text-orange-500 uppercase mb-3">Churroverse</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Gourmet churros crafted across dimensions. Fueled by flavor, powered by the cosmos.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[["Fleet (Products)", "/products"], ["Our Story", "/about"], ["Mission Control", "/contact"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Commander Hub</h4>
            <ul className="space-y-2">
              {[["Control Center", "/dashboard"], ["Login", "/login"], ["Register", "/register"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} Churroverse. All rights reserved across all galaxies.</p>
          <p className="text-xs text-gray-700 font-mono">v2.0 — Deep Space Edition</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [featRes, bestRes] = await Promise.all([
          fetch("/api/products?featured=true"),
          fetch("/api/products?sort=rating&limit=4"),
        ]);
        const featData = await featRes.json();
        const bestData = await bestRes.json();
        setFeatured(featData.products?.length ? featData.products : MOCK_FEATURED);
        setBestsellers(bestData.products?.length ? bestData.products.slice(0, 4) : MOCK_BESTSELLERS);
      } catch {
        setFeatured(MOCK_FEATURED);
        setBestsellers(MOCK_BESTSELLERS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <HeroSection />
      {!loading && <FeaturedSection products={featured} />}
      <CategoriesSection />
      {!loading && <BestsellersSection products={bestsellers} />}
      <FeaturesSection />
      <ReviewsSection />
      <NewsletterSection />
      <FooterSection />
    </div>
  );
}
