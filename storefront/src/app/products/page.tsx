"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddToCartButton from "@/components/ui/AddToCartButton";
import WishlistButton from "@/components/ui/WishlistButton";
import type { Product, ProductCategory, SortOption } from "@/lib/types";
import { formatPrice } from "@/lib/types";

const CATEGORIES: { key: ProductCategory; label: string; emoji: string }[] = [
  { key: "all", label: "All Galaxies", emoji: "🌌" },
  { key: "churro", label: "Churro Planet", emoji: "🌀" },
  { key: "shake", label: "Nebula Drinks", emoji: "🥤" },
  { key: "iced-tea", label: "Iced Tea Nebula", emoji: "🧊" },
  { key: "waffle", label: "Waffle Planet", emoji: "🧇" },
  { key: "munchies", label: "Munchies Planet", emoji: "🍟" },
];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "rating", label: "Top Rated" },
  { key: "price-asc", label: "Price: Low → High" },
  { key: "price-desc", label: "Price: High → Low" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${
            s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative border border-white/10 rounded-3xl bg-white/5 hover:border-orange-500/30 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Tag */}
      {product.tag && (
        <span className="absolute top-3 left-3 z-10 text-xs font-bold px-2.5 py-1 rounded-full bg-orange-600 text-white shadow">
          {product.tag}
        </span>
      )}

      {/* Wishlist */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton product={product} size="sm" />
      </div>

      {/* Product visual */}
      <Link href={`/products/${product.id}`}>
        <div className="relative h-52 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black overflow-hidden">
          {/* Glow behind emoji */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:w-32 group-hover:h-32 group-hover:bg-orange-500/20 transition-all duration-500" />
          </div>
          <motion.span
            className="text-6xl relative z-10 drop-shadow-lg"
            whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
          >
            {product.emoji}
          </motion.span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-black text-white text-lg mb-1 group-hover:text-orange-400 transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={product.rating} />
          <span className="text-gray-500 text-xs">({product.review_count})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-orange-400">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && (
              <span className="text-sm text-gray-600 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
          {product.compare_price && (
            <span className="text-xs text-green-400 font-mono bg-green-900/30 px-2 py-0.5 rounded-full">
              {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% off
            </span>
          )}
        </div>

        <AddToCartButton product={product} fullWidth />
      </div>
    </motion.div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<ProductCategory>("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (search) params.set("search", search);
      params.set("sort", sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, search, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page header */}
        <div className="py-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-orange-400 font-mono text-sm uppercase tracking-widest mb-2"
          >
            — Energy Fleet Catalogue —
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-4"
          >
            The Fleet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-xl"
          >
            Every capsule is handcrafted in our zero-gravity kitchen. Select your energy and prepare for liftoff.
          </motion.p>
        </div>

        {/* Search + Filters bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search energy capsules..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white text-sm focus:outline-none focus:border-orange-500 cursor-pointer min-w-[180px]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key} className="bg-gray-900">
                {o.label}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() => setShowFilters((v) => !v)}
            className="rounded-full border-white/10 text-gray-400 hover:text-white gap-2 sm:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORIES.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                category === key
                  ? "bg-orange-600 text-white shadow-[0_0_12px_rgba(234,88,12,0.5)] scale-105"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:border-orange-500/30 hover:text-white"
              }`}
            >
              <span>{emoji}</span> {label}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-gray-600 mb-6 font-mono">
            {products.length} capsule{products.length !== 1 ? "s" : ""} found
            {search ? ` for "${search}"` : ""}
            {category !== "all" ? ` in ${category}` : ""}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
                <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-orange-400 animate-pulse" />
              </div>
              <p className="text-gray-500 text-sm font-mono">Scanning the nebula...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🛸</div>
            <h3 className="text-xl font-bold text-white mb-2">No capsules found</h3>
            <p className="text-gray-500 mb-6">Try a different search or category.</p>
            <Button
              onClick={() => { setSearchInput(""); setSearch(""); setCategory("all"); }}
              className="bg-orange-600 hover:bg-orange-500 rounded-full"
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
