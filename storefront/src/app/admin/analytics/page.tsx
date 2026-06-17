"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Award,
} from "lucide-react";
import { formatPrice } from "@/lib/types";
import type { Analytics } from "@/lib/admin";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => setAnalytics(d.analytics))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const a = analytics!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Detailed store performance</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatPrice(a.totalRevenue), icon: DollarSign, color: "bg-green-600/20 text-green-400" },
          { label: "Total Orders", value: a.totalOrders.toLocaleString(), icon: ShoppingBag, color: "bg-blue-600/20 text-blue-400" },
          { label: "Avg Order Value", value: formatPrice(a.averageOrderValue), icon: TrendingUp, color: "bg-purple-600/20 text-purple-400" },
          { label: "Total Customers", value: a.totalUsers.toLocaleString(), icon: Users, color: "bg-orange-600/20 text-orange-400" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-white/5 bg-[#111118] p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400">{kpi.label}</p>
            </div>
            <p className="text-xl font-bold text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-medium text-gray-400">Revenue Trend (Last 14 Days)</h2>
        </div>
        {a.revenueByDay.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No revenue data yet</p>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-1.5 h-48">
              {a.revenueByDay.map((d) => {
                const max = Math.max(...a.revenueByDay.map((x) => x.revenue), 1);
                const height = (d.revenue / max) * 100;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(d.revenue / 100).toFixed(0)}
                    </span>
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-orange-600/40 to-orange-500/60 hover:to-orange-400 transition-all cursor-pointer"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <span className="text-[10px] text-gray-500">{d.date.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Orders by Status */}
        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Orders by Status</h2>
          {a.ordersByStatus.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {a.ordersByStatus.map((s) => {
                const total = a.ordersByStatus.reduce((sum, x) => sum + x.count, 0);
                const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
                return (
                  <div key={s.status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300 capitalize flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          s.status === "delivered" ? "bg-green-500" :
                          s.status === "cancelled" ? "bg-red-500" :
                          s.status === "paid" ? "bg-green-400" :
                          s.status === "processing" ? "bg-blue-500" :
                          s.status === "shipped" ? "bg-purple-500" :
                          "bg-yellow-500"
                        }`} />
                        {s.status}
                      </span>
                      <span className="text-gray-400">{s.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-600/60 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-medium text-gray-400">Top Selling Products</h2>
          </div>
          {a.topProducts.length === 0 ? (
            <p className="text-gray-500 text-sm">No products sold yet</p>
          ) : (
            <div className="space-y-2">
              {a.topProducts.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-gray-500 w-5 font-mono">{i + 1}</span>
                    <span className="text-sm text-white truncate">{p.emoji} {p.name}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-400">{p.total_sold} sold</span>
                    <span className="text-xs text-gray-500">{formatPrice(p.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
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
