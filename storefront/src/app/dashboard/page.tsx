"use client";

import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  User, Package, Heart, MapPin, Settings, LogOut,
  Rocket, Star, Zap, ChevronRight, Clock, Loader2
} from "lucide-react";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { useWishlistStore } from "@/store/useWishlistStore";

const navItems = [
  { key: "overview", label: "Profile Overview", icon: User, href: "/dashboard" },
  { key: "orders", label: "Mission History", icon: Package, href: "/dashboard" },
  { key: "wishlist", label: "Galactic Wishlist", icon: Heart, href: "/dashboard" },
  { key: "addresses", label: "Coordinates", icon: MapPin, href: "/dashboard/addresses" },
  { key: "rewards", label: "Cosmic Rewards", icon: Star, href: "/dashboard/rewards" },
  { key: "settings", label: "Settings", icon: Settings, href: "/dashboard" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d } }),
};

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  paid: { bg: "bg-green-500/20", text: "text-green-400" },
  processing: { bg: "bg-blue-500/20", text: "text-blue-400" },
  shipped: { bg: "bg-orange-500/20", text: "text-orange-400" },
  delivered: { bg: "bg-green-500/20", text: "text-green-400" },
  cancelled: { bg: "bg-red-500/20", text: "text-red-400" },
};

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const syncFromDB = useWishlistStore((s) => s.syncFromDB);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/login");
    }
  }, [isLoaded, userId, router]);

  useEffect(() => {
    if (userId) {
      syncFromDB(userId);
      fetchOrders(userId);
    }
  }, [userId, syncFromDB]);

  async function fetchOrders(uId: string) {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?userId=${uId}`);
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  }

  if (!isLoaded || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-orange-500/50 animate-pulse" />
      </div>
    );
  }

  const firstName = user?.firstName || "Commander";
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page header */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="py-10">
          <p className="text-orange-400 font-mono text-sm uppercase tracking-widest mb-2">— Commander Control Center —</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Welcome back, <span className="text-orange-400">{firstName}.</span>
          </h1>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="w-full md:w-64 flex-shrink-0"
          >
            {/* Avatar card */}
            <div className="border border-white/10 rounded-2xl bg-white/5 p-5 mb-4 flex items-center gap-4">
              <UserButton />
              <div>
                <p className="font-bold text-white text-sm">{user?.fullName || "Commander"}</p>
                <p className="text-xs text-orange-400 font-mono">Star Explorer</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
              {navItems.map(({ key, label, icon: Icon, href }) => (
                href === "/dashboard" ? (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors text-left border-b border-white/5 last:border-0 ${
                      activeSection === key
                        ? "bg-orange-600/20 text-orange-400 border-l-2 border-l-orange-500"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ) : (
                  <Link
                    key={key}
                    href={href}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors text-left border-b border-white/5 ${
                      false
                        ? "bg-orange-600/20 text-orange-400 border-l-2 border-l-orange-500"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                )
              ))}
              <button className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors border-t border-white/10">
                <LogOut className="w-4 h-4" />
                Abort Mission (Logout)
              </button>
            </nav>
          </motion.aside>

          {/* Main content */}
          <main className="flex-1 space-y-6">
            {/* Stats */}
            <motion.div
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: Zap, label: "Energy Balance", value: `${totalOrders} Orders`, colorClass: "from-orange-900/30", iconClass: "text-orange-400", valClass: "text-orange-400" },
                { icon: Rocket, label: "Completed Missions", value: `${deliveredOrders} Delivered`, colorClass: "from-yellow-900/30", iconClass: "text-yellow-400", valClass: "text-yellow-400" },
                { icon: Star, label: "Total Spent", value: formatPrice(totalSpent), colorClass: "from-blue-900/30", iconClass: "text-blue-400", valClass: "text-blue-400" },
              ].map(({ icon: Icon, label, value, colorClass, iconClass, valClass }) => (
                <div
                  key={label}
                  className={`border border-white/10 rounded-2xl p-5 bg-gradient-to-br ${colorClass} to-black hover:border-orange-500/30 transition-colors`}
                >
                  <Icon className={`w-5 h-5 ${iconClass} mb-3`} />
                  <p className="text-gray-400 text-xs mb-1">{label}</p>
                  <p className={`text-2xl font-black ${valClass}`}>{value}</p>
                </div>
              ))}
            </motion.div>

            {/* Recent orders */}
            <motion.div
              custom={0.3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-400" />
                  Active Missions
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-400 hover:text-orange-300"
                  onClick={() => setActiveSection("orders")}
                >
                  View All <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🛸</div>
                  <p className="text-gray-500">No missions yet. Time to launch your first order!</p>
                  <Link href="/products">
                    <Button size="sm" className="mt-4 bg-orange-600 hover:bg-orange-500 rounded-full">
                      Browse the Fleet
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {orders.slice(0, 5).map((order) => {
                    const colors = statusColors[order.status] ?? statusColors.pending;
                    const itemCount = order.items?.length ?? 0;
                    return (
                      <Link
                        key={order.id}
                        href={`/dashboard/orders/${order.id}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 hover:bg-white/5 transition-colors"
                      >
                        <div>
                          <p className="font-bold text-white">Mission #{order.order_number}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            {" · "}
                            {itemCount} item{itemCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-mono px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <span className="text-white font-bold">{formatPrice(order.total)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Quick actions */}
            <motion.div
              custom={0.4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <Link href="/products" className="group border border-white/10 rounded-2xl bg-white/5 p-5 hover:border-orange-500/30 transition-all hover:bg-orange-950/20">
                <Rocket className="w-6 h-6 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-white mb-1">Browse the Fleet</h3>
                <p className="text-sm text-gray-500">Discover new energy capsules</p>
              </Link>
              <Link href="/cart" className="group border border-white/10 rounded-2xl bg-white/5 p-5 hover:border-yellow-500/30 transition-all hover:bg-yellow-950/20">
                <Zap className="w-6 h-6 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-white mb-1">Launch Manifest</h3>
                <p className="text-sm text-gray-500">Review items in your cart</p>
              </Link>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
