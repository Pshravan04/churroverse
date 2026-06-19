"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Package, Users, DollarSign, ArrowUpRight, TrendingUp } from "lucide-react";
import type { Analytics } from "@/lib/admin";
import { motion } from "framer-motion";

const cards = [
  { title: "Total Revenue", key: "totalRevenue" as const, icon: DollarSign, href: "/admin/analytics", gradient: "from-green-600/20 to-emerald-600/10", border: "border-green-500/20", glow: "rgba(34,197,94,0.15)", fmt: (v: number) => `₹${(v / 100).toLocaleString("en-IN")}` },
  { title: "Orders", key: "totalOrders" as const, icon: ShoppingBag, href: "/admin/orders", gradient: "from-blue-600/20 to-indigo-600/10", border: "border-blue-500/20", glow: "rgba(59,130,246,0.15)", fmt: (v: number) => v.toLocaleString() },
  { title: "Products", key: "totalProducts" as const, icon: Package, href: "/admin/products", gradient: "from-purple-600/20 to-violet-600/10", border: "border-purple-500/20", glow: "rgba(168,85,247,0.15)", fmt: (v: number) => v.toLocaleString() },
  { title: "Customers", key: "totalUsers" as const, icon: Users, href: "/admin/users", gradient: "from-orange-600/20 to-rose-600/10", border: "border-orange-500/20", glow: "rgba(234,88,12,0.15)", fmt: (v: number) => v.toLocaleString() },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 12 } },
};

export default function AdminDashboard() {
  const [a, setA] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => setA(d.analytics))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
            <Package className="absolute inset-0 m-auto w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <p className="text-gray-600 text-sm font-mono">Loading mission data...</p>
        </div>
      </div>
    );
  }

  if (!a) return null;

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
        </div>
        <p className="text-sm text-gray-500 ml-11">Mission Control — store overview from orbit</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <motion.div key={c.key} variants={item}>
            <Link
              href={c.href}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#0a0a12] p-5 hover:border-white/10 transition-all block"
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              {/* Glow */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
                style={{ background: `radial-gradient(circle, ${c.glow}, transparent)` }}
              />
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium group-hover:text-gray-400 transition-colors">{c.title}</p>
                    <p className="text-2xl font-black text-white mt-1.5 tabular-nums">{c.fmt(a[c.key])}</p>
                  </div>
                  <div className={`p-2.5 rounded-lg bg-white/[0.04] border ${c.border} group-hover:scale-110 transition-transform duration-300`}>
                    <c.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <ArrowUpRight className="absolute bottom-0 right-0 w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="rounded-xl border border-white/5 bg-[#0a0a12] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Revenue (14 days)
          </h2>
          {a.revenueByDay.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <DollarSign className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No revenue data yet</p>
              <p className="text-xs text-gray-600">Orders will appear here once placed</p>
            </div>
          ) : (
            <BarChart data={a.revenueByDay} />
          )}
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/5 bg-[#0a0a12] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Orders by Status
          </h2>
          {a.ordersByStatus.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <ShoppingBag className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No orders yet</p>
              <p className="text-xs text-gray-600">Orders will appear here once placed</p>
            </div>
          ) : (
            <StatusBars data={a.ordersByStatus} />
          )}
        </motion.div>
      </div>

      {/* Top Products */}
      {a.topProducts.length > 0 && (
        <motion.div variants={item} className="rounded-xl border border-white/5 bg-[#0a0a12] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Top Products
          </h2>
          <div className="space-y-1">
            {a.topProducts.slice(0, 5).map((p, i) => {
              const sold = p.total_sold ?? 0;
              const maxSold = Math.max(...a.topProducts.slice(0, 5).map((x) => x.total_sold ?? 0), 1);
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors text-sm group relative overflow-hidden"
                >
                  {/* Progress bar bg */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-orange-500/5 rounded-lg transition-all duration-700"
                    style={{ width: `${(sold / maxSold) * 100}%` }}
                  />
                  <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
                    <span className={`w-5 text-xs font-mono ${i === 0 ? "text-orange-400" : "text-gray-600"}`}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                    <span className="text-white truncate">{p.emoji} {p.name}</span>
                  </div>
                  <span className="relative z-10 text-gray-400 font-mono text-xs">{sold} sold</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function BarChart({ data }: { data: { date: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue)) || 1;
  return (
    <div className="flex items-end gap-1.5 h-36">
      {data.map((d, i) => {
        const pct = (d.revenue / max) * 100;
        return (
          <motion.div
            key={d.date}
            className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02, type: "spring" as const, stiffness: 80 }}
          >
            <div className="relative w-full">
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-orange-600 to-orange-500/80 group-hover:to-orange-400 transition-all"
                style={{ height: `${Math.max(pct, 4)}%` }}
              />
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111118] border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono whitespace-nowrap pointer-events-none z-10">
                ₹{(d.revenue / 100).toLocaleString("en-IN")}
              </div>
            </div>
            <span className="text-[10px] text-gray-600">{d.date.slice(5)}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function StatusBars({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((s, x) => s + x.count, 0);
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    paid: "bg-green-500",
    processing: "bg-blue-500",
    shipped: "bg-purple-500",
    delivered: "bg-emerald-500",
    cancelled: "bg-red-500",
  };
  return (
    <div className="space-y-3">
      {data.map((s, i) => (
        <motion.div
          key={s.status}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center justify-between text-sm mb-1.5">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusColors[s.status] ?? "bg-gray-500"}`} />
              <span className="text-gray-300 capitalize font-medium">{s.status}</span>
            </div>
            <span className="text-gray-500 font-mono text-xs">{s.count}</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${statusColors[s.status]}`}
              initial={{ width: 0 }}
              animate={{ width: `${(s.count / total) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
