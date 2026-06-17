"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@clerk/nextjs";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  className = "",
  size = "md",
  fullWidth = false,
}: AddToCartButtonProps) {
  const { userId } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const sizeClasses = {
    sm: "text-xs px-3 py-2",
    md: "text-sm px-5 py-3",
    lg: "text-lg px-8 py-4",
  };

  async function handleClick() {
    if (state !== "idle") return;
    setState("loading");
    try {
      await addItem(product, quantity, userId);
      setState("success");
      // Reset after 2.5s
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("idle");
    }
  }

  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading" || product.stock === 0}
      className={`
        relative overflow-hidden rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2
        ${fullWidth ? "w-full" : ""}
        ${sizeClasses[size]}
        ${
          product.stock === 0
            ? "bg-white/10 text-gray-500 cursor-not-allowed"
            : state === "success"
            ? "bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]"
            : "bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)] hover:shadow-[0_0_25px_rgba(234,88,12,0.7)] hover:scale-105 active:scale-95"
        }
        ${className}
      `}
    >
      {/* Success particle burst */}
      <AnimatePresence>
        {state === "success" && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: Math.cos((i / 8) * Math.PI * 2) * 40,
                  y: Math.sin((i / 8) * Math.PI * 2) * 40,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute w-1.5 h-1.5 rounded-full bg-yellow-400 pointer-events-none"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.span
        key={state}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2"
      >
        {state === "loading" ? (
          <Loader2 className={`${iconSize} animate-spin`} />
        ) : state === "success" ? (
          <Check className={iconSize} />
        ) : (
          <ShoppingBag className={iconSize} />
        )}

        {product.stock === 0
          ? "Out of Stock"
          : state === "loading"
          ? "Adding..."
          : state === "success"
          ? "Added! 🚀"
          : "Add to Cart"}
      </motion.span>
    </button>
  );
}
