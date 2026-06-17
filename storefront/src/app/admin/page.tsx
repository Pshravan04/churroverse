"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import type { Analytics } from "@/lib/admin";

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#111118] p-5 hover:border-white/10 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <ArrowUpRight className="absolute bottom-3 right-3 w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
    </Link>
  );
}

export default function AdminDashboard() {
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
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Overview of your store</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${(a.totalRevenue / 100).toLocaleString("en-IN")}`}
          icon={DollarSign}
          href="/admin/analytics"
          color="bg-green-600/30"
        />
        <StatCard
          title="Orders"
          value={a.totalOrders.toLocaleString()}
          icon={ShoppingBag}
          href="/admin/orders"
          color="bg-blue-600/30"
        />
        <StatCard
          title="Products"
          value={a.totalProducts.toLocaleString()}
          icon={Package}
          href="/admin/products"
          color="bg-purple-600/30"
        />
        <StatCard
          title="Customers"
          value={a.totalUsers.toLocaleString()}
          icon={Users}
          href="/admin/users"
          color="bg-orange-600/30"
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue chart */}
        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Revenue (Last 14 Days)</h2>
          {a.revenueByDay.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <div className="flex items-end gap-1.5 h-32">
              {a.revenueByDay.map((d) => {
                const max = Math.max(...a.revenueByDay.map((x) => x.revenue));
                const height = max > 0 ? (d.revenue / max) * 100 : 0;
                return (
                  <div
                    key={d.date}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-[10px] text-gray-500">
                      ₹{(d.revenue / 100).toFixed(0)}
                    </span>
                    <div
                      className="w-full rounded-t bg-orange-600/60 hover:bg-orange-500 transition-colors"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <span className="text-[10px] text-gray-500">
                      {d.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Orders by status */}
        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Orders by Status</h2>
          {a.ordersByStatus.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {a.ordersByStatus.map((s) => {
                const total = a.ordersByStatus.reduce((sum, x) => sum + x.count, 0);
                const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
                return (
                  <div key={s.status} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300 capitalize">{s.status}</span>
                      <span className="text-gray-400">{s.count}</span>
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
      </div>

      {/* Top Products */}
      {a.topProducts.length > 0 && (
        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Top Products</h2>
          <div className="space-y-2">
            {a.topProducts.slice(0, 5).map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-5">{i + 1}.</span>
                  <span className="text-sm text-white">{p.emoji} {p.name}</span>
                </div>
                <span className="text-sm text-gray-400">{p.total_sold} sold</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
