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
} from "lucide-react";
import { useState } from "react";

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
    user?.emailAddresses?.some((e) => e.emailAddress === "admin@churroverse.com" || e.emailAddress === "shravanphutanr@gmail.com");

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#020010] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020010] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Rocket className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You do not have admin privileges. Please contact the site owner.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
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
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-64
          bg-[#111118] border-r border-white/5
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <Rocket className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg tracking-tight text-white">
              CHURROVERSE
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-orange-600/20 text-orange-400"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }
                `}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all duration-150"
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
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">
              {user?.emailAddresses?.[0]?.emailAddress}
            </span>
            <div className="w-8 h-8 rounded-full bg-orange-600/30 flex items-center justify-center text-sm font-bold text-orange-400">
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
