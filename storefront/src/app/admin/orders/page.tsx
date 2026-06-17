"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingBag, Search, ChevronDown } from "lucide-react";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/types";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-green-500/20 text-green-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const statuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchOrders();
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? o.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-sm text-gray-400 mt-1">{orders.length} orders</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search order # or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111118] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-600/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#111118] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50"
        >
          <option value="">All Status</option>
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#111118] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Order</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Customer</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Total</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No orders found
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-white font-mono text-xs">{o.order_number}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs hidden sm:table-cell">
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs hidden md:table-cell truncate max-w-[120px]">
                    {(o.shipping_address as unknown as Record<string, string>)?.full_name ?? o.user_id.slice(0, 8)}
                  </td>
                  <td className="py-3 px-4 text-right text-white font-mono text-xs">
                    {formatPrice(o.total)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative group">
                      <button
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${statusColors[o.status] ?? "bg-gray-500/20 text-gray-400"}`}
                      >
                        {o.status}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="absolute top-full left-0 mt-1 bg-[#1a1a2e] border border-white/10 rounded-lg py-1 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl">
                        {statuses.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(o.id, s)}
                            className={`block w-full text-left px-3 py-1.5 text-xs capitalize hover:bg-white/5 transition-colors ${
                              s === o.status ? "text-orange-400" : "text-gray-400"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
