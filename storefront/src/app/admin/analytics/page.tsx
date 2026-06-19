"use client";

import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, ShoppingBag, Package, Users, Award, BarChart3 } from "lucide-react";
import { formatPrice } from "@/lib/types";
import type { Analytics } from "@/lib/admin";
import { motion } from "framer-motion";

const kpis = [
  { label: "Total Revenue", key: "totalRevenue" as const, icon: DollarSign, gradient: "from-green-600/20 to-emerald-600/10", border: "border-green-500/20", fmt: (v: number) => formatPrice(v) },
  { label: "Orders", key: "totalOrders" as const, icon: ShoppingBag, gradient: "from-blue-600/20 to-indigo-600/10", border: "border-blue-500/20", fmt: (v: number) => v.toLocaleString() },
  { label: "Avg Order Value", key: "averageOrderValue" as const, icon: TrendingUp, gradient: "from-purple-600/20 to-violet-600/10", border: "border-purple-500/20", fmt: (v: number) => formatPrice(v) },
  { label: "Customers", key: "totalUsers" as const, icon: Users, gradient: "from-orange-600/20 to-rose-600/10", border: "border-orange-500/20", fmt: (v: number) => v.toLocaleString() },
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
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } },
};

export default function AdminAnalytics() {
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
            <BarChart3 className="absolute inset-0 m-auto w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <p className="text-gray-600 text-sm font-mono">Crunching numbers...</p>
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
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <h1 className="text-2xl font-black text-white">Analytics</h1>
        </div>
        <p className="text-sm text-gray-500 ml-11">Deep-dive store performance metrics</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <motion.div key={k.key} variants={item}>
            <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#0a0a12] p-4 hover:border-white/10 transition-all">
              <div className={`absolute inset-0 bg-gradient-to-br ${k.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-white/[0.04] border ${k.border} group-hover:scale-110 transition-transform duration-300`}>
                    <k.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{k.label}</p>
                </div>
                <p className="text-xl font-black text-white tabular-nums">{k.fmt(a[k.key])}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="rounded-xl border border-white/5 bg-[#0a0a12] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Revenue (Last 14 Days)
          </h2>
          {a.revenueByDay.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <TrendingUp className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No revenue data yet</p>
            </div>
          ) : (
            <RevenueChart data={a.revenueByDay} />
          )}
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/5 bg-[#0a0a12] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Orders by Status
          </h2>
          {a.ordersByStatus.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <ShoppingBag className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <StatusChart data={a.ordersByStatus} />
          )}
        </motion.div>
      </div>

      {/* Top Products */}
      {a.topProducts.length > 0 && (
        <motion.div variants={item} className="rounded-xl border border-white/5 bg-[#0a0a12] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-yellow-400" />
            <h2 className="text-sm font-medium text-gray-400">Top Selling Products</h2>
          </div>
          <div className="space-y-1">
            {a.topProducts.map((p, i) => {
              const sold = p.total_sold ?? 0;
              const maxSold = Math.max(...a.topProducts.map((x) => x.total_sold ?? 0), 1);
              return (
                <motion.div
                  key={p.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors text-sm group relative overflow-hidden"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="absolute left-0 top-0 bottom-0 bg-orange-500/5 rounded-lg transition-all duration-700" style={{ width: `${(sold / maxSold) * 100}%` }} />
                  <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
                    <span className={`w-5 text-xs font-mono ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-400" : "text-gray-600"}`}>
                      {["🥇", "🥈", "🥉"][i] ?? `#${i + 1}`}
                    </span>
                    <span className="text-white truncate">{p.emoji} {p.name}</span>
                  </div>
                  <div className="relative z-10 flex items-center gap-4">
                    <span className="text-gray-500 font-mono text-xs">{sold} sold</span>
                    <span className="text-gray-600 font-mono text-xs">{formatPrice(p.price)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      <motion.div variants={item} className="rounded-xl border border-white/5 bg-[#0a0a12] p-5">
        <h2 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: "Total Products", value: a.totalProducts.toLocaleString(), icon: Package },
            { label: "Revenue/Order", value: formatPrice(a.averageOrderValue), icon: TrendingUp },
            { label: "Total Revenue", value: formatPrice(a.totalRevenue), icon: DollarSign },
            { label: "Unique Customers", value: a.totalUsers.toLocaleString(), icon: Users },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
              <s.icon className="w-5 h-5 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500 text-xs font-medium">{s.label}</p>
              <p className="text-white font-black text-lg mt-1 tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue)) || 1;
  return (
    <div className="flex items-end gap-1.5 h-48">
      {data.map((d, i) => (
        <motion.div
          key={d.date}
          className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.02, type: "spring", stiffness: 80 }}
        >
          <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
            ₹{(d.revenue / 100).toFixed(0)}
          </span>
          <div className="w-full rounded-t-sm bg-gradient-to-t from-orange-600/40 to-orange-500/60 group-hover:to-orange-400/80 transition-all" style={{ height: `${Math.max((d.revenue / max) * 100, 4)}%` }} />
          <span className="text-[10px] text-gray-600">{d.date.slice(5)}</span>
        </motion.div>
      ))}
    </div>
  );
}

function StatusChart({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((s, x) => s + x.count, 0);
  const colors: Record<string, string> = { delivered: "bg-green-500", cancelled: "bg-red-500", paid: "bg-green-400", processing: "bg-blue-500", shipped: "bg-purple-500", pending: "bg-yellow-500" };
  return (
    <div className="space-y-4">
      {data.map((s, i) => (
        <motion.div
          key={s.status}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-gray-300 capitalize flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${colors[s.status] ?? "bg-gray-500"}`} />
              {s.status}
            </span>
            <span className="text-gray-500 font-mono text-xs">
              {s.count} ({total > 0 ? Math.round((s.count / total) * 100) : 0}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${colors[s.status] ?? "bg-gray-500"}`}
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
