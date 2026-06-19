"use client";

import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  User, Package, Heart, MapPin, Star, Settings,
  Rocket, Zap, Mail, Phone, Calendar, ChevronRight, Loader2
} from "lucide-react";
import { formatPrice } from "@/lib/types";
import type { Order } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d } }),
};

export default function ProfilePage() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [phoneInput, setPhoneInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/login");
    }
  }, [isLoaded, userId, router]);

  useEffect(() => {
    if (!userId) return;
    fetchOrders(userId);
  }, [userId]);

  useEffect(() => {
    setPhoneInput(user?.phoneNumbers?.[0]?.phoneNumber ?? "");
  }, [user]);

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

  const updatePhone = async () => {
    if (!user || !phoneInput.trim()) return;
    setSaving(true);
    setMsg("");
    try {
      const existing = user.phoneNumbers?.[0];
      if (existing) {
        await existing.destroy();
      }
      if (phoneInput.trim()) {
        await user.createPhoneNumber({ phoneNumber: phoneInput.trim() });
      }
      setMsg("Phone updated successfully!");
    } catch {
      setMsg("Failed to update phone. Try again.");
    } finally {
      setSaving(false);
    }
  };

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
  const phoneNumber = user?.phoneNumbers?.[0]?.phoneNumber ?? "";

  const stats = [
    { icon: Zap, label: "Total Orders", value: `${totalOrders}`, colorClass: "from-orange-900/30", iconClass: "text-orange-400", valClass: "text-orange-400" },
    { icon: Rocket, label: "Delivered", value: `${deliveredOrders}`, colorClass: "from-yellow-900/30", iconClass: "text-yellow-400", valClass: "text-yellow-400" },
    { icon: Star, label: "Total Spent", value: formatPrice(totalSpent), colorClass: "from-blue-900/30", iconClass: "text-blue-400", valClass: "text-blue-400" },
  ];

  const quickLinks = [
    { icon: Package, label: "Mission History", href: "/dashboard", desc: "View your orders" },
    { icon: Heart, label: "Galactic Wishlist", href: "/dashboard", desc: "Saved items" },
    { icon: MapPin, label: "Coordinates", href: "/dashboard/addresses", desc: "Saved addresses" },
  ];

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="py-10">
          <p className="text-orange-400 font-mono text-sm uppercase tracking-widest mb-2">— Star Chart —</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Commander Profile
          </h1>
        </motion.div>

        {/* Avatar + Info Card */}
        <motion.div
          custom={0.1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="border border-white/10 rounded-2xl bg-white/5 p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-500/50">
                <UserButton />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-white">{user?.fullName || "Commander"}</h2>
              <p className="text-sm text-orange-400 font-mono">Star Explorer</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.primaryEmailAddress?.emailAddress || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "Unknown"}
                </span>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:text-white hover:border-orange-500 rounded-full">
                Full Dashboard <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          custom={0.15}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          {stats.map(({ icon: Icon, label, value, colorClass, iconClass, valClass }) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone Section */}
          <motion.div
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="border border-white/10 rounded-2xl bg-white/5 p-6"
          >
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <Phone className="w-4 h-4 text-orange-400" />
              Contact Number
            </h3>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+919876543210"
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500 outline-none"
              />
              <button
                onClick={updatePhone}
                disabled={saving}
                className="px-5 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-500 disabled:opacity-50 rounded-lg text-white transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
            </div>
            {msg && <p className="text-xs mt-2 text-gray-400">{msg}</p>}
            {!phoneNumber && (
              <p className="text-xs text-yellow-400/70 mt-2 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Add a phone number for order tracking updates
              </p>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            custom={0.25}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="border border-white/10 rounded-2xl bg-white/5 p-6"
          >
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <Rocket className="w-4 h-4 text-orange-400" />
              Quick Navigation
            </h3>
            <div className="space-y-2">
              {quickLinks.map(({ icon: Icon, label, href, desc }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
                    <div>
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-orange-400 transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden mt-6"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-400" />
              Recent Missions
            </h2>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300">
                View All <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
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
                const statusColors: Record<string, string> = {
                  pending: "text-yellow-400 bg-yellow-500/20",
                  paid: "text-green-400 bg-green-500/20",
                  processing: "text-blue-400 bg-blue-500/20",
                  shipped: "text-orange-400 bg-orange-500/20",
                  delivered: "text-green-400 bg-green-500/20",
                  cancelled: "text-red-400 bg-red-500/20",
                };
                const sc = statusColors[order.status] ?? "text-gray-400 bg-white/10";
                return (
                  <Link
                    key={order.id}
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-white">Mission #{order.order_number}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-mono px-3 py-1 rounded-full ${sc}`}>
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

        {/* Account Security */}
        <motion.div
          custom={0.35}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="border border-white/10 rounded-2xl bg-white/5 p-6 mt-6"
        >
          <h3 className="font-bold text-white flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-orange-400" />
            Account Security
          </h3>
          <p className="text-sm text-gray-500">
            Manage your password and connected accounts via{" "}
            <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
              Clerk Dashboard
            </a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
