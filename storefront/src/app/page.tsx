"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
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
  { id: "m1", slug: "cosmic-churro", name: "Cosmic Churro Classic", description: "Cinnamon-dusted spirals, caramel-filled, lightly crispy.", long_desc: null, price: 24900, compare_price: null, category: "churro", emoji: "🌀", stock: 50, rating: 4.8, review_count: 312, tag: "Best Seller", featured: true, images: ["/products/classic.png"], metadata: {}, created_at: "" },
  { id: "m2", slug: "dark-matter", name: "Dark Matter Chocolate", description: "Rich 70% dark chocolate ganache fused into every bite.", long_desc: null, price: 29900, compare_price: 34900, category: "churro", emoji: "🍫", stock: 40, rating: 4.9, review_count: 218, tag: "New Arrival", featured: true, images: ["/products/dark-matter.png"], metadata: {}, created_at: "" },
  { id: "m3", slug: "stardust-biscoff", name: "Stardust Biscoff", description: "Belgian Biscoff cream swirled through crunchy dough.", long_desc: null, price: 27900, compare_price: null, category: "churro", emoji: "⭐", stock: 35, rating: 4.7, review_count: 156, tag: "Fan Favorite", featured: true, images: ["/products/biscoff.png"], metadata: {}, created_at: "" },
  { id: "m8", slug: "supernova-matcha", name: "Supernova Matcha", description: "Japanese ceremonial matcha cream with white chocolate drizzle.", long_desc: null, price: 31900, compare_price: 36900, category: "churro", emoji: "🍵", stock: 20, rating: 4.9, review_count: 189, tag: "Limited", featured: true, images: ["/products/matcha.png"], metadata: {}, created_at: "" },
];


const MOCK_BESTSELLERS: Product[] = [
  { id: "m4", slug: "nebula-nutella", name: "Nebula Nutella", description: "Hazelnut cocoa spread meets warm churro dough.", long_desc: null, price: 28900, compare_price: null, category: "churro", emoji: "🌌", stock: 30, rating: 4.9, review_count: 312, tag: null, featured: false, images: ["/products/nutella.png"], metadata: {}, created_at: "" },
  { id: "m5", slug: "solar-strawberry", name: "Solar Strawberry", description: "Sun-ripened strawberries in a sweet glaze.", long_desc: null, price: 25900, compare_price: null, category: "churro", emoji: "🌟", stock: 45, rating: 4.8, review_count: 218, tag: null, featured: false, images: ["/products/strawberry.png"], metadata: {}, created_at: "" },
  { id: "m6", slug: "orion-oreo", name: "Orion Oreo Blast", description: "Crushed Oreo cookies fused into every ridge.", long_desc: null, price: 31900, compare_price: 36900, category: "churro", emoji: "🪐", stock: 25, rating: 5.0, review_count: 156, tag: null, featured: false, images: ["/products/oreo.png"], metadata: {}, created_at: "" },
  { id: "m7", slug: "galaxy-caramel", name: "Galaxy Caramel", description: "House-made caramel sauce, stretched and pulled to perfection.", long_desc: null, price: 26900, compare_price: null, category: "churro", emoji: "✨", stock: 60, rating: 4.7, review_count: 445, tag: null, featured: false, images: ["/products/caramel.png"], metadata: {}, created_at: "" },
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

// Accent palettes per card index
const CARD_ACCENTS = [
  { glow: "rgba(234,88,12,0.35)",  ring: "border-orange-500/30",  tagBg: "bg-orange-600",     gradFrom: "from-orange-950/60",  gradTo: "to-red-950/40",    text: "text-orange-400",  btn: "from-orange-600 to-red-600" },
  { glow: "rgba(168,85,247,0.35)", ring: "border-purple-500/30",  tagBg: "bg-purple-600",     gradFrom: "from-purple-950/60", gradTo: "to-indigo-950/40", text: "text-purple-400", btn: "from-purple-600 to-indigo-600" },
  { glow: "rgba(245,158,11,0.35)", ring: "border-amber-500/30",   tagBg: "bg-amber-600",      gradFrom: "from-amber-950/60",  gradTo: "to-orange-950/40", text: "text-amber-400",  btn: "from-amber-600 to-orange-600" },
  { glow: "rgba(34,197,94,0.35)",  ring: "border-emerald-500/30", tagBg: "bg-emerald-600",    gradFrom: "from-emerald-950/60",gradTo: "to-teal-950/40",  text: "text-emerald-400", btn: "from-emerald-600 to-teal-600" },
];

function FeaturedAccordionItem({
  product,
  index,
  isHovered,
  onHover,
}: {
  product: Product;
  index: number;
  isHovered: boolean;
  onHover: () => void;
}) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const savings = product.compare_price ? product.compare_price - product.price : 0;

  return (
    <motion.div
      layout
      onMouseEnter={onHover}
      onClick={onHover}
      className={`group relative rounded-[2rem] border ${accent.ring} overflow-hidden cursor-pointer flex flex-col lg:flex-row bg-white/[0.02] backdrop-blur-md transition-all duration-500`}
      animate={{
        flex: isHovered ? (typeof window !== "undefined" && window.innerWidth >= 1024 ? 3.5 : 2) : 1,
      }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
    >
      {/* Background glow & gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradFrom} ${accent.gradTo} transition-opacity duration-700 ${isHovered ? "opacity-80" : "opacity-30"}`} />
      
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 m-auto w-64 h-64 lg:w-96 lg:h-96 rounded-full blur-[100px] pointer-events-none"
        style={{ background: accent.glow }}
      />

      {/* Visual Area */}
      <div className="relative z-10 flex items-center justify-center p-6 lg:p-12 h-32 lg:h-full lg:w-48 shrink-0">
        <motion.div
          layout
          animate={{
            scale: isHovered ? 1.4 : 1,
            rotate: isHovered ? [0, -5, 5, 0] : 0,
            y: isHovered ? [0, -10, 0] : 0,
          }}
          transition={{
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
          }}
          className="relative drop-shadow-2xl select-none flex items-center justify-center w-full h-full"
        >
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]" 
              style={{ maxHeight: '200px' }}
            />
          ) : (
            <span className="text-[5rem] lg:text-[7rem]">{product.emoji}</span>
          )}
        </motion.div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="popLayout">
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative z-10 p-6 pt-0 lg:p-12 lg:pl-0 flex flex-col justify-center flex-1 min-w-[280px]"
          >
            {product.tag && (
              <span className={`self-start ${accent.tagBg} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg mb-3 lg:mb-4`}>
                {product.tag}
              </span>
            )}
            
            <h3 className={`text-3xl lg:text-5xl font-black text-white leading-tight mb-2 lg:mb-3 group-hover:${accent.text} transition-colors`}>
              {product.name}
            </h3>
            
            <p className="text-gray-300 text-sm lg:text-base mb-4 lg:mb-6 max-w-md line-clamp-2 lg:line-clamp-3">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <StarRating rating={product.rating} size="md" />
              <span className={`font-bold ${accent.text}`}>{product.rating}</span>
              <span className="text-gray-500 text-xs lg:text-sm">({product.review_count} reviews)</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-auto gap-4">
              <div className="flex flex-col">
                {product.compare_price && (
                  <span className="text-sm text-gray-500 line-through mb-1">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl lg:text-4xl font-black ${accent.text}`}>
                    {formatPrice(product.price)}
                  </span>
                  {savings > 0 && (
                    <span className="text-xs text-emerald-400 font-bold ml-2">
                      Save {formatPrice(savings)}
                    </span>
                  )}
                </div>
              </div>
              
              <Link href={`/products/${product.id}`} className="shrink-0 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${accent.btn} text-white font-bold px-6 py-3 lg:px-8 lg:py-4 rounded-full shadow-lg transition-shadow hover:shadow-2xl hover:shadow-${accent.tagBg.replace("bg-", "")}/50`}
                >
                  <ShoppingCart className="w-5 h-5" /> Order Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Non-hovered state vertical title (Desktop) / Horizontal (Mobile) */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-0 right-0 lg:bottom-auto lg:top-0 lg:left-0 lg:right-0 lg:h-full flex items-center justify-center pointer-events-none px-4 text-center"
          >
            <h3 className="text-sm lg:text-xl font-black uppercase tracking-widest lg:tracking-[0.2em] text-white/50 group-hover:text-white/80 transition-colors lg:origin-center lg:-rotate-90 whitespace-nowrap">
              {product.name}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>
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
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  if (!products.length) return null;

  return (
    <section className="w-full py-24 md:py-36 relative overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020010] via-[#080415] to-[#020010]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-orange-900/15 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-900/15 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>

          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-orange-400/80 font-mono text-xs uppercase tracking-[0.3em] mb-4">
              <span className="w-6 h-px bg-orange-400/50" />
              Handcrafted in Zero Gravity
              <span className="w-6 h-px bg-orange-400/50" />
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500">Flavors</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-md mx-auto text-sm leading-relaxed">
              Our most-loved churros — each one a journey through a different corner of the cosmos.
            </p>
          </motion.div>

          {/* Accordion Gallery */}
          <motion.div variants={fadeUp} className="flex flex-col lg:flex-row gap-4 h-[700px] lg:h-[550px]">
            {products.slice(0, 4).map((p, i) => (
              <FeaturedAccordionItem
                key={p.id}
                product={p}
                index={i}
                isHovered={hoveredIndex === i}
                onHover={() => setHoveredIndex(i)}
              />
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold px-8 py-4 rounded-full shadow-[0_0_30px_rgba(234,88,12,0.35)] hover:shadow-[0_0_50px_rgba(234,88,12,0.55)] transition-all"
              >
                <Sparkles className="w-4 h-4" /> View All Capsules
              </motion.button>
            </Link>
            <Link href="/products?sort=rating">
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="flex items-center gap-2 border border-white/20 text-white font-bold px-8 py-4 rounded-full hover:bg-white/5 transition-all backdrop-blur-sm"
              >
                Top Rated <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}


// Category accent configs
const CAT_STYLES = [
  { bg: "from-orange-950 to-red-950",   glow: "rgba(234,88,12,0.5)",   border: "border-orange-500/30",  text: "text-orange-400",  badge: "bg-orange-600",  count: "12" },
  { bg: "from-pink-950 to-purple-950",  glow: "rgba(236,72,153,0.5)",  border: "border-pink-500/30",   text: "text-pink-400",    badge: "bg-pink-600",    count: "8"  },
  { bg: "from-amber-950 to-yellow-950", glow: "rgba(245,158,11,0.5)",  border: "border-amber-500/30",  text: "text-amber-400",  badge: "bg-amber-600",   count: "6"  },
  { bg: "from-yellow-950 to-orange-950",glow: "rgba(251,191,36,0.5)",  border: "border-yellow-500/30", text: "text-yellow-400", badge: "bg-yellow-600",  count: "9"  },
  { bg: "from-red-950 to-orange-950",   glow: "rgba(220,38,38,0.5)",   border: "border-red-500/30",    text: "text-red-400",    badge: "bg-red-600",     count: "10" },
];

function CategoriesSection() {
  return (
    <section className="w-full py-24 md:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020010] via-black to-[#020010]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-indigo-900/15 blur-[150px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>

          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-indigo-400/80 font-mono text-xs uppercase tracking-[0.3em] mb-4">
              <span className="w-6 h-px bg-indigo-400/50" />
              5 Known Dimensions
              <span className="w-6 h-px bg-indigo-400/50" />
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Explore the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Universe</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              Every flavor category is a distinct cosmic world. Pick your dimension and begin the journey.
            </p>
          </motion.div>

          {/* Category grid — large hero card + 4 smaller */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr] gap-5">

            {/* Hero card — first category */}
            {CATEGORIES.slice(0, 1).map((cat, i) => {
              const s = CAT_STYLES[0];
              return (
                <motion.div key={cat.key} variants={fadeUp} custom={0}
                  whileHover={{ scale: 1.02 }}
                  className={`group relative rounded-3xl border ${s.border} bg-gradient-to-br ${s.bg} overflow-hidden md:row-span-2 flex flex-col justify-between min-h-[340px] cursor-pointer`}
                >
                  {/* Animated glow */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full blur-[80px] pointer-events-none"
                    style={{ background: s.glow }}
                  />
                  {/* Count badge */}
                  <div className="relative z-10 p-6 flex justify-between items-start">
                    <span className={`${s.badge} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest`}>
                      {s.count} items
                    </span>
                    <motion.div whileHover={{ rotate: -45 }} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  {/* Emoji */}
                  <div className="relative z-10 flex items-center justify-center flex-1">
                    <motion.div
                      animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="text-[8rem] leading-none"
                    >
                      {cat.emoji}
                    </motion.div>
                  </div>
                  {/* Info */}
                  <div className="relative z-10 p-6 pt-0">
                    <h3 className={`font-black text-2xl text-white mb-1`}>{cat.label}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{cat.desc}</p>
                    <Link href={`/products?category=${cat.key}`}
                      className={`inline-flex items-center gap-2 ${s.text} font-bold text-sm border ${s.border} px-4 py-2 rounded-full hover:bg-white/5 transition-colors`}
                    >
                      Explore Dimension <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <Link href={`/products?category=${cat.key}`} className="absolute inset-0 rounded-3xl" aria-label={`Explore ${cat.label}`} />
                </motion.div>
              );
            })}

            {/* Smaller cards — remaining 4 categories */}
            {CATEGORIES.slice(1).map((cat, i) => {
              const s = CAT_STYLES[i + 1];
              return (
                <motion.div key={cat.key} variants={fadeUp} custom={(i + 1) * 0.08}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`group relative rounded-2xl border ${s.border} bg-gradient-to-br ${s.bg} overflow-hidden p-5 flex items-center gap-4 cursor-pointer min-h-[145px]`}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 30% 50%, ${s.glow} 0%, transparent 65%)` }}
                  />
                  {/* Emoji */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                    <motion.span
                      animate={{ rotate: [-2, 2, -2] }}
                      transition={{ duration: 3 + i, repeat: Infinity }}
                      className="text-3xl"
                    >
                      {cat.emoji}
                    </motion.span>
                  </div>
                  {/* Info */}
                  <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`${s.badge} text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                        {s.count} items
                      </span>
                      <motion.div
                        whileHover={{ x: 3 }}
                        className={`${s.text} opacity-0 group-hover:opacity-100 transition-opacity`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.div>
                    </div>
                    <h3 className="font-black text-white text-base leading-tight">{cat.label}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mt-0.5 line-clamp-2">{cat.desc}</p>
                  </div>
                  <Link href={`/products?category=${cat.key}`} className="absolute inset-0 rounded-2xl" aria-label={`Explore ${cat.label}`} />
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div variants={fadeUp} className="text-center mt-12">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="inline-flex items-center gap-2 border border-indigo-500/30 text-indigo-300 font-bold px-8 py-4 rounded-full hover:bg-indigo-950/30 transition-all backdrop-blur-sm"
              >
                <Rocket className="w-4 h-4" /> Browse All Dimensions
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


// Compact card — used in Bestsellers stack
function CompactFeaturedCard({ product, index, accent }: { product: Product; index: number; accent: typeof CARD_ACCENTS[0] }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.12}
      whileHover={{ x: 6 }}
      className={`group relative rounded-2xl border ${accent.ring} bg-white/[0.03] backdrop-blur-sm overflow-hidden flex items-stretch transition-all duration-300 hover:bg-white/[0.06]`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${accent.gradFrom} ${accent.gradTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Visual side */}
      <Link href={`/products/${product.id}`}
        className="relative z-10 flex items-center justify-center w-28 flex-shrink-0 bg-white/[0.03]"
      >
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle, ${accent.glow} 0%, transparent 70%)` }} />
        {product.images && product.images.length > 0 ? (
          <motion.img 
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3 + index, repeat: Infinity }}
            src={product.images[0]}
            alt={product.name}
            className="w-20 h-20 object-contain relative z-10 filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
          />
        ) : (
          <motion.span
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 3 + index, repeat: Infinity }}
            className="text-5xl relative z-10"
          >
            {product.emoji}
          </motion.span>
        )}
      </Link>

      {/* Info side */}
      <div className="relative z-10 flex-1 p-4 flex flex-col justify-between">
        <div>
          {product.tag && (
            <span className={`${accent.tagBg} text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5 inline-block`}>
              {product.tag}
            </span>
          )}
          <Link href={`/products/${product.id}`}>
            <h3 className={`font-black text-white text-base group-hover:${accent.text} transition-colors leading-tight`}>
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={product.rating} />
            <span className="text-gray-600 text-[10px]">({product.review_count})</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-lg font-black ${accent.text}`}>{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-[11px] text-gray-600 line-through">{formatPrice(product.compare_price)}</span>
            )}
          </div>
          <Link href={`/products/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className={`text-[11px] font-bold ${accent.text} border ${accent.ring} px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-white/5 transition-colors`}
            >
              View <ArrowRight className="w-3 h-3" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
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
          <div className="flex flex-col gap-4">
            {products.slice(0, 4).map((p, i) => (
              <CompactFeaturedCard
                key={p.id}
                product={p}
                index={i}
                accent={CARD_ACCENTS[i % CARD_ACCENTS.length]}
              />
            ))}
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
