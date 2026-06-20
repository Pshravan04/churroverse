"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@clerk/nextjs";
import { createPortal } from "react-dom";
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
  const [rockets, setRockets] = useState<{ id: number; startX: number; startY: number }[]>([]);
  const [cartPos, setCartPos] = useState<{ x: number; y: number } | null>(null);

  // Get cart icon position periodically or on mount/resize
  useEffect(() => {
    const updateCartPos = () => {
      const cartIcon = document.getElementById("nav-cart-icon");
      if (cartIcon) {
        const rect = cartIcon.getBoundingClientRect();
        setCartPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    };
    updateCartPos();
    window.addEventListener("resize", updateCartPos);
    return () => window.removeEventListener("resize", updateCartPos);
  }, []);

  const sizeClasses = {
    sm: "text-xs px-3 py-2",
    md: "text-sm px-5 py-3",
    lg: "text-lg px-8 py-4",
  };

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (state !== "idle") return;
    
    if (cartPos) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newRocket = {
        id: Date.now(),
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
      };
      setRockets(prev => [...prev, newRocket]);
      setTimeout(() => {
        setRockets(prev => prev.filter(r => r.id !== newRocket.id));
      }, 1000);
    }
    
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
          ? "Added!"
          : "Add to Cart"}
      </motion.span>
      
      {/* Rocket Animation Portal */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {rockets.map(rocket => (
            <motion.div
              key={rocket.id}
              initial={{ x: rocket.startX, y: rocket.startY, scale: 0.5, opacity: 0, rotate: -45 }}
              animate={{ 
                x: [rocket.startX, rocket.startX + (cartPos?.x && rocket.startX > cartPos.x ? -50 : 50), cartPos?.x || 0], 
                y: [rocket.startY, rocket.startY - 150, cartPos?.y || 0],
                scale: [0.5, 1.5, 0.2],
                opacity: [0, 1, 0],
                rotate: [-45, 0, 45]
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="fixed z-[9999] text-4xl pointer-events-none drop-shadow-[0_0_20px_rgba(234,88,12,0.8)]"
              style={{ marginLeft: -16, marginTop: -16 }}
            >
              <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_20px_4px_rgba(234,88,12,0.8)]" />
            </motion.div>
          ))}
        </AnimatePresence>,
        document.body
      )}
    </button>
  );
}
