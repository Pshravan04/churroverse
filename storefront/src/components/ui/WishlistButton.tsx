"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

interface WishlistButtonProps {
  product: Product;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export default function WishlistButton({
  product,
  size = "md",
  showLabel = false,
}: WishlistButtonProps) {
  const { userId } = useAuth();
  const router = useRouter();
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const [isAnimating, setIsAnimating] = useState(false);

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      router.push("/login");
      return;
    }

    setIsAnimating(true);
    await toggle(userId, product);
    setTimeout(() => setIsAnimating(false), 600);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`
        flex items-center gap-1.5 rounded-full transition-all duration-300
        ${size === "sm" ? "p-1.5" : "p-2.5"}
        ${
          isWishlisted
            ? "bg-red-500/20 text-red-400 border border-red-500/40"
            : "bg-white/10 text-gray-400 border border-white/10 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10"
        }
      `}
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        <Heart
          className={`${iconSize} transition-all duration-300 ${
            isWishlisted ? "fill-red-400" : "fill-none"
          }`}
        />
      </motion.div>
      {showLabel && (
        <span className="text-xs font-medium">
          {isWishlisted ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
