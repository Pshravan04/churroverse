"use client";

import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, ShoppingBag, Package, Users, Award } from "lucide-react";
import { formatPrice } from "@/lib/types";
import type { Analytics } from "@/lib/admin";

const kpis = [
  { label: "Total Revenue", key: "totalRevenue" as const, icon: DollarSign, color: "text-green-400", bg: "bg-green-600/20", fmt: (v: number) => formatPrice(v) },
  { label: "Orders", key: "totalOrders" as const, icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-600/20", fmt: (v: number) => v.toLocaleString() },
  { label: "Avg Order Value", key: "averageOrderValue" as const, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-600/20", fmt: (v: number) => formatPrice(v) },
  { label: "Customers", key: "totalUsers" as const, icon: Users, color: "text-orange-400", bg: "bg-orange-600/20", fmt: (v: number) => v.toLocaleString() },
];

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
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!a) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Detailed store performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.key} className="rounded-xl border border-white/5 bg-[#111118] p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${k.bg} ${k.color}`}><k.icon className="w-4 h-4" /></div>
              <p className="text-xs text-gray-400">{k.label}</p>
            </div>
            <p className="text-xl font-bold text-white">{k.fmt(a[k.key])}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Revenue (Last 14 Days)</h2>
          {a.revenueByDay.length === 0 ? (
            <div className="text-center py-12 text-gray-500"><TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm">No revenue data yet</p></div>
          ) : (
            <RevenueChart data={a.revenueByDay} />
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Orders by Status</h2>
          {a.ordersByStatus.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <StatusChart data={a.ordersByStatus} />
          )}
        </div>
      </div>

      {a.topProducts.length > 0 && (
        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <div className="flex items-center gap-2 mb-4"><Award className="w-4 h-4 text-gray-400" /><h2 className="text-sm font-medium text-gray-400">Top Selling Products</h2></div>
          <div className="space-y-1">
            {a.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors text-sm">
                <span className="text-gray-500 w-5 text-xs font-mono">{i + 1}</span>
                <span className="flex-1 text-white truncate">{p.emoji} {p.name}</span>
                <span className="text-gray-400 mr-4">{p.total_sold} sold</span>
                <span className="text-gray-500">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
        <h2 className="text-sm font-medium text-gray-400 mb-4">Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: "Total Products", value: a.totalProducts.toLocaleString(), icon: Package },
            { label: "Revenue/Order", value: formatPrice(a.averageOrderValue), icon: TrendingUp },
            { label: "Total Revenue", value: formatPrice(a.totalRevenue), icon: DollarSign },
            { label: "Unique Customers", value: a.totalUsers.toLocaleString(), icon: Users },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-lg bg-white/[0.02]">
              <s.icon className="w-4 h-4 text-gray-500 mx-auto mb-1" />
              <p className="text-gray-400 text-xs">{s.label}</p>
              <p className="text-white font-bold text-base mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue)) || 1;
  return (
    <div className="flex items-end gap-1.5 h-48">
      {data.map((d) => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group">
          <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100">₹{(d.revenue / 100).toFixed(0)}</span>
          <div className="w-full rounded-t bg-gradient-to-t from-orange-600/40 to-orange-500/60" style={{ height: `${Math.max((d.revenue / max) * 100, 4)}%` }} />
          <span className="text-[10px] text-gray-500">{d.date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

function StatusChart({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((s, x) => s + x.count, 0);
  const colors: Record<string, string> = { delivered: "bg-green-500", cancelled: "bg-red-500", paid: "bg-green-400", processing: "bg-blue-500", shipped: "bg-purple-500", pending: "bg-yellow-500" };
  return (
    <div className="space-y-4">
      {data.map((s) => (
        <div key={s.status}>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-gray-300 capitalize flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${colors[s.status] ?? "bg-gray-500"}`} />{s.status}
            </span>
            <span className="text-gray-400">{s.count} ({total > 0 ? Math.round((s.count / total) * 100) : 0}%)</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-orange-600/60" style={{ width: `${(s.count / total) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
