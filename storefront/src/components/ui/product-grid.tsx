"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

type ProductGridProps = {
  products: {
    id: string;
    name: string;
    price: number;
    tag?: string;
    emoji?: string;
    description?: string;
    rating?: number;
    reviews?: number;
  }[];
  onAddToCart?: (productId: string) => void;
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay },
  }),
};

export default function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          variants={fadeUp}
          custom={index * 0.1}
          whileHover={{ y: -8 }}
          className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden hover:border-orange-500/40 transition-all duration-300"
        >
          {/* Badge */}
          {product.tag && (
            <div className="absolute top-4 right-4 z-10 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.tag}
            </div>
          )}

          {/* Product visual */}
          <div className="aspect-square w-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
            {product.emoji ? (
              <span className="text-8xl">{product.emoji}</span>
            ) : (
              <div className="w-24 h-24 rounded-full bg-orange-500/20 blur-3xl" />
            )}
          </div>

          {/* Info */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
            {product.description && (
              <p className="text-gray-400 text-sm mb-4">{product.description}</p>
            )}

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-3 h-3 ${
                      idx < Math.floor(product.rating!)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
                {product.reviews && (
                  <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                )}
              </div>
            )}

            {/* Price + CTA */}
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black text-orange-400">₹{product.price}</p>
              <Link
                href={`/products/${product.id}`}
                className="inline-flex items-center justify-center h-8 px-3 bg-white text-black hover:bg-yellow-400 rounded-full text-sm font-bold transition-all"
              >
                View Details
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
