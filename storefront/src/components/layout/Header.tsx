"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "./HeaderAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import CartDrawer from "@/components/ui/CartDrawer";

const navLinks = [
  { href: "/products", label: "Fleet" },
  { href: "/about", label: "Story" },
  { href: "/contact", label: "Mission Control" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();

  // Live cart count from Zustand
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 shadow-[0_0_12px_rgba(234,88,12,0.7)] group-hover:shadow-[0_0_20px_rgba(234,88,12,0.9)] transition-all duration-300" />
            <span className="text-2xl font-black text-white tracking-tighter uppercase">
              Churro<span className="text-orange-500">verse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-sm font-bold uppercase tracking-widest transition-colors group ${
                  pathname === href ? "text-orange-400" : "text-gray-300 hover:text-white"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-orange-500 transition-all duration-300 ${
                    pathname === href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <HeaderAuth />

            {/* Cart trigger — opens drawer */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setCartOpen(true)}
              className="relative text-gray-300 hover:text-white hover:bg-white/10 hidden md:flex"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 rounded-full text-xs flex items-center justify-center text-white font-bold"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </Button>

            <Link href="/products">
              <Button
                size="sm"
                className="hidden md:flex bg-orange-600 hover:bg-orange-500 text-white rounded-full px-5 shadow-[0_0_15px_rgba(234,88,12,0.4)] hover:shadow-[0_0_25px_rgba(234,88,12,0.7)] transition-all"
              >
                Shop Now
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 md:hidden"
          >
            <nav className="flex flex-col p-6 gap-2">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${
                    pathname === href
                      ? "bg-orange-500/20 text-orange-400"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => { setMobileOpen(false); setCartOpen(true); }}
                className="px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Cart {totalItems > 0 && `(${totalItems})`}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
