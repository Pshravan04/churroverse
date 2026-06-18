"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Package, Users, DollarSign, ArrowUpRight } from "lucide-react";
import type { Analytics } from "@/lib/admin";

const cards = [
  { title: "Total Revenue", key: "totalRevenue" as const, icon: DollarSign, href: "/admin/analytics", color: "bg-green-600/30", fmt: (v: number) => `₹${(v / 100).toLocaleString("en-IN")}` },
  { title: "Orders", key: "totalOrders" as const, icon: ShoppingBag, href: "/admin/orders", color: "bg-blue-600/30", fmt: (v: number) => v.toLocaleString() },
  { title: "Products", key: "totalProducts" as const, icon: Package, href: "/admin/products", color: "bg-purple-600/30", fmt: (v: number) => v.toLocaleString() },
  { title: "Customers", key: "totalUsers" as const, icon: Users, href: "/admin/users", color: "bg-orange-600/30", fmt: (v: number) => v.toLocaleString() },
];

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
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!a) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#111118] p-5 hover:border-white/10 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">{c.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{c.fmt(a[c.key])}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${c.color}`}>
                <c.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <ArrowUpRight className="absolute bottom-3 right-3 w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Revenue (14 days)</h2>
          {a.revenueByDay.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <BarChart data={a.revenueByDay} />
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Orders by Status</h2>
          {a.ordersByStatus.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <StatusBars data={a.ordersByStatus} />
          )}
        </div>
      </div>

      {a.topProducts.length > 0 && (
        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Top Products</h2>
          <div className="space-y-1">
            {a.topProducts.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors text-sm">
                <span className="text-gray-500 w-5 text-xs">{i + 1}.</span>
                <span className="flex-1 text-white">{p.emoji} {p.name}</span>
                <span className="text-gray-400">{p.total_sold} sold</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BarChart({ data }: { data: { date: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue)) || 1;
  const values = data.map((d) => ({ date: d.date.slice(5), pct: (d.revenue / max) * 100 }));
  return (
    <div className="flex items-end gap-1.5 h-32">
      {values.map((v) => (
        <div key={v.date} className="flex-1 flex flex-col items-center gap-1" title={`₹${v.pct.toFixed(0)}`}>
          <div className="w-full rounded-t bg-orange-600/60" style={{ height: `${Math.max(v.pct, 4)}%` }} />
          <span className="text-[10px] text-gray-500">{v.date}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBars({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((s, x) => s + x.count, 0);
  return (
    <div className="space-y-3">
      {data.map((s) => (
        <div key={s.status}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-300 capitalize">{s.status}</span>
            <span className="text-gray-400">{s.count}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-orange-600/60" style={{ width: `${(s.count / total) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
