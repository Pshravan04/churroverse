"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, Zap, Shield, ChevronDown, Rocket, ArrowRight } from "lucide-react";

// ── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const featuredProducts = [
  {
    id: "1",
    name: "Cosmic Churro Classic",
    price: 249,
    tag: "Best Seller",
    emoji: "🌀",
    color: "from-orange-900/60 to-yellow-900/20",
    glow: "rgba(234,88,12,0.3)",
    description: "Cinnamon-dusted spirals, caramel-filled, lightly crispy.",
  },
  {
    id: "2",
    name: "Dark Matter Chocolate",
    price: 299,
    tag: "New Arrival",
    emoji: "🍫",
    color: "from-purple-900/60 to-indigo-900/20",
    glow: "rgba(139,92,246,0.3)",
    description: "Rich 70% dark chocolate ganache fused into every bite.",
  },
  {
    id: "3",
    name: "Stardust Biscoff",
    price: 279,
    tag: "Fan Favorite",
    emoji: "⭐",
    color: "from-amber-900/60 to-yellow-900/20",
    glow: "rgba(245,158,11,0.3)",
    description: "Belgian Biscoff cream swirled through crunchy dough.",
  },
];

const planets = [
  { name: "Chocolate", color: "#3d1a0a", glow: "#b45309", emoji: "🍫" },
  { name: "Biscoff", color: "#1a0f00", glow: "#d97706", emoji: "⭐" },
  { name: "Nutella", color: "#1a0e00", glow: "#c2410c", emoji: "🌰" },
  { name: "Strawberry", color: "#1a0012", glow: "#be185d", emoji: "🍓" },
];

const bestSellers = [
  { id: "4", name: "Nebula Nutella", price: 289, rating: 4.9, reviews: 312, emoji: "🌌" },
  { id: "5", name: "Solar Strawberry", price: 259, rating: 4.8, reviews: 218, emoji: "🌟" },
  { id: "6", name: "Orion Oreo Blast", price: 319, rating: 5.0, reviews: 156, emoji: "🪐" },
  { id: "7", name: "Galaxy Caramel", price: 269, rating: 4.7, reviews: 445, emoji: "✨" },
];

const timeline = [
  { year: "2019", title: "The Big Bang", body: "Two astrophysicist pastry chefs combine forces in a Madrid kitchen. The Churroverse is born." },
  { year: "2021", title: "First Orbit", body: "Our first store opens. 1,000 churros sold in 24 hours. The galaxy is watching." },
  { year: "2023", title: "Warp Speed", body: "We launch online delivery across 30 countries. Flavors beam directly to your door." },
  { year: "2025", title: "Deep Space", body: "Churroverse 2.0 — interactive 3D experience, 12 new galaxy flavors, space-grade packaging." },
];

const reviews = [
  { name: "Commander Reyes", rank: "Star Admiral", rating: 5, text: "These churros defied the laws of physics. Absolutely explosive flavor." },
  { name: "Nova Kim", rank: "Galactic Explorer", rating: 5, text: "I've traveled 14 galaxies. Nothing compares to the Cosmic Classic." },
  { name: "Lt. Adaeze", rank: "Fleet Officer", rating: 5, text: "Our entire crew ordered the Dark Matter box. Zero survivors. Zero regrets." },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* ── SECTION 1: GALACTIC HERO ─────────────────────────────────────── */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Radial glow behind hero text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px]" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="z-10 text-center space-y-6 max-w-5xl px-4"
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            className="text-orange-400 font-mono text-sm uppercase tracking-[0.3em]"
          >
            🚀 Welcome to the Universe of Flavor
          </motion.p>

          <motion.h1
            custom={0.1}
            variants={fadeUp}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 uppercase leading-none drop-shadow-[0_0_30px_rgba(255,165,0,0.4)]"
          >
            Churro
            <br />
            <span className="text-white">verse</span>
          </motion.h1>

          <motion.p
            custom={0.2}
            variants={fadeUp}
            className="text-xl md:text-2xl font-light text-gray-300 tracking-wide max-w-xl mx-auto"
          >
            Where Every Bite Powers A Galaxy
          </motion.p>

          <motion.div
            custom={0.3}
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Link href="/products">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-500 text-white rounded-full px-10 py-6 text-lg font-bold shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:shadow-[0_0_50px_rgba(234,88,12,0.7)] transition-all duration-300 hover:scale-105 group"
              >
                Explore Universe
                <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10 py-6 text-lg font-bold border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 bg-black/30 backdrop-blur-sm"
              >
                Our Story
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            custom={0.5}
            variants={fadeUp}
            className="flex items-center justify-center gap-8 pt-8"
          >
            {[
              { value: "30+", label: "Galaxies Reached" },
              { value: "50K+", label: "Commanders Served" },
              { value: "12", label: "Cosmic Flavors" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-orange-400">{value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── SECTION 2: FEATURED ENERGY CAPSULES ─────────────────────────── */}
      <section className="w-full py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black pointer-events-none" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-orange-400 font-mono text-sm uppercase tracking-widest mb-4">
              — Handcrafted in Zero Gravity —
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-white">
              Featured Energy Capsules
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredProducts.map((p) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="group relative rounded-3xl border border-white/10 overflow-hidden bg-black/40 backdrop-blur-md transition-all duration-300 hover:border-orange-500/40"
                style={{
                  boxShadow: `0 0 0 0 ${p.glow}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${p.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${p.glow}`;
                }}
              >
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {p.tag}
                </div>

                {/* Product visual */}
                <div className={`aspect-square w-full bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                  <span className="text-8xl">{p.emoji}</span>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-orange-400">₹{p.price}</p>
                    <Link href={`/products/${p.id}`}>
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-yellow-400 rounded-full font-bold transition-all"
                      >
                        Add to Cart
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/products">
              <Button
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10 group"
              >
                View All Capsules
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 3: EXPLORE THE PLANETS ───────────────────────────────── */}
      <section className="w-full py-32 bg-black relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[400px] rounded-full bg-indigo-900/20 blur-[100px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-purple-400 font-mono text-sm uppercase tracking-widest mb-4">
              — 4 Known Dimensions —
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-white">
              Explore The Planets
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 mt-4 max-w-lg mx-auto">
              Each flavor originates from a different corner of the Churroverse. Choose your planet, choose your destiny.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {planets.map((planet) => (
              <motion.div
                key={planet.name}
                variants={fadeUp}
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.97 }}
                className="group relative aspect-square rounded-full border-2 border-white/10 cursor-pointer flex flex-col items-center justify-center overflow-hidden transition-all duration-300"
                style={{ background: `radial-gradient(circle at 35% 35%, ${planet.glow}40, #020010 70%)` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = planet.glow;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${planet.glow}60`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <span className="text-4xl mb-2">{planet.emoji}</span>
                <h3 className="text-base font-bold text-white">{planet.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Planet</p>
                <Link
                  href={`/products?category=${planet.name.toLowerCase()}`}
                  className="absolute inset-0 rounded-full"
                  aria-label={`Explore ${planet.name} planet`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4: BEST SELLERS ───────────────────────────────────────── */}
      <section className="w-full py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-yellow-400 font-mono text-sm uppercase tracking-widest mb-4">
              — Mission-Critical Picks —
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-white">
              Best Sellers
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {bestSellers.map((p, i) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                custom={i * 0.1}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:border-yellow-500/40 hover:bg-yellow-900/10 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{p.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3 h-3 ${idx < Math.floor(p.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({p.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-yellow-400">₹{p.price}</p>
                  <Link href={`/products/${p.id}`}>
                    <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-white">
                      View →
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 5: STORYTELLING TIMELINE ─────────────────────────────── */}
      <section className="w-full py-32 bg-black relative overflow-hidden">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-600/50 to-transparent -translate-x-1/2 hidden md:block" />

        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.p variants={fadeUp} className="text-orange-400 font-mono text-sm uppercase tracking-widest mb-4">
              — Origin Story —
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-white">
              The Churroverse Chronicle
            </motion.h2>
          </motion.div>

          <div className="relative space-y-16 max-w-3xl mx-auto">
            {timeline.map((event, i) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`flex items-center gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"} md:flex-row`}
              >
                {/* Year bubble */}
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-orange-600/20 border-2 border-orange-500 flex items-center justify-center text-orange-400 font-black text-sm shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                  {event.year}
                </div>
                {/* Content */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{event.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: HOLOGRAPHIC REVIEWS ───────────────────────────────── */}
      <section className="w-full py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-blue-400 font-mono text-sm uppercase tracking-widest mb-4">
              — Intercepted Transmissions —
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-white">
              Commander Reviews
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 hover:border-blue-500/40 transition-all duration-300"
              >
                {/* Holographic top accent */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed mb-6 italic">"{r.text}"</p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{r.name}</p>
                    <p className="text-xs text-blue-400 font-mono">{r.rank}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 7: SPACE TERMINAL NEWSLETTER ─────────────────────────── */}
      <section className="w-full py-32 bg-black relative overflow-hidden">
        {/* Terminal scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] rounded-full bg-green-900/20 blur-[100px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-2xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
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

            <motion.form
              variants={fadeUp}
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                placeholder="commander@galaxy.space"
                className="flex-1 bg-white/5 border border-white/20 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors font-mono"
              />
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white rounded-full px-8 py-4 font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_35px_rgba(234,88,12,0.7)] transition-all whitespace-nowrap"
              >
                <Zap className="w-4 h-4 mr-2" />
                Engage Uplink
              </Button>
            </motion.form>

            <motion.p variants={fadeUp} className="text-xs text-gray-600 mt-4 flex items-center justify-center gap-2">
              <Shield className="w-3 h-3" />
              No spam transmissions. Unsubscribe anytime from any galaxy.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-white/10 py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-black text-orange-500 uppercase mb-3">Churroverse</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Gourmet churros crafted across dimensions. Fueled by flavor, powered by the cosmos.
              </p>
            </div>
            {/* Links */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Navigation</h4>
              <ul className="space-y-2">
                {[["Fleet (Products)", "/products"], ["Our Story", "/about"], ["Mission Control", "/contact"]].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Commander Hub</h4>
              <ul className="space-y-2">
                {[["Control Center", "/dashboard"], ["Login", "/login"], ["Register", "/register"]].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Churroverse. All rights reserved across all galaxies.
            </p>
            <p className="text-xs text-gray-700 font-mono">v2.0 — Deep Space Edition</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
