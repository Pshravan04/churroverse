"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tags,
  BarChart3,
  LogOut,
  Rocket,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/discounts", label: "Discounts", icon: Tags },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin =
    user?.publicMetadata?.role === "admin" ||
    user?.emailAddresses?.some(
      (e) => e.emailAddress === "admin@churroverse.com" || e.emailAddress === "shravanphutanr@gmail.com"
    );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#020010] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
            <Rocket className="absolute inset-0 m-auto w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <p className="text-gray-500 text-sm font-mono">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020010] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Rocket className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-8">
            You do not have admin privileges. Please contact the site owner.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_35px_rgba(234,88,12,0.5)]"
          >
            <LogOut className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020010] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-64
          bg-[#0a0a12] border-r border-white/5
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5 relative">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_10px_rgba(234,88,12,0.3)] group-hover:shadow-[0_0_15px_rgba(234,88,12,0.5)] transition-all">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white block leading-tight">
                CHURROVERSE
              </span>
              <span className="text-[10px] text-orange-500 font-mono uppercase tracking-widest">Mission Control</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 relative group
                    ${
                      isActive
                        ? "bg-orange-600/15 text-orange-400 border border-orange-500/20"
                        : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] border border-transparent"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-full"
                    />
                  )}
                  <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                  {item.label}
                  {isActive && (
                    <ChevronRight className="w-3 h-3 ml-auto text-orange-500/50" />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-white/5"
          >
            <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#020010]/80 backdrop-blur-md border-b border-white/5 flex items-center px-4 lg:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-white transition-colors p-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block font-mono">
              {user?.emailAddresses?.[0]?.emailAddress}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_10px_rgba(234,88,12,0.3)]">
              {(user?.firstName?.[0] ?? "A").toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
