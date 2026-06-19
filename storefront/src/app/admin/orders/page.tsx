"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingBag, Search, ChevronDown, Package } from "lucide-react";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  paid: "bg-green-500/20 text-green-400 border-green-500/20",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/20",
  delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/20",
};

const statusDot: Record<string, string> = {
  pending: "bg-yellow-500",
  paid: "bg-green-500",
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-red-500",
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
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
            <Package className="absolute inset-0 m-auto w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <p className="text-gray-600 text-sm font-mono">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Orders</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">{orders.length} orders in system</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search order # or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a12] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-600/50 transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#0a0a12] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50 transition-colors"
        >
          <option value="">All Status</option>
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </motion.div>

      {/* Table */}
      <motion.div
        className="rounded-xl border border-white/5 bg-[#0a0a12] overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Order</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Total</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-500">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No orders found</p>
                    <p className="text-xs text-gray-600 mt-1">Try adjusting your search or filter</p>
                  </td>
                </tr>
              )}
              {filtered.map((o, i) => (
                <motion.tr
                  key={o.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => window.location.href = `/admin/orders/${o.id}`}
                >
                  <td className="py-3.5 px-4">
                    <span className="text-white font-mono text-xs tracking-wider">{o.order_number}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs hidden sm:table-cell font-mono">
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 text-xs hidden md:table-cell truncate max-w-[140px]">
                    {(o.shipping_address as unknown as Record<string, string>)?.full_name ?? o.user_id.slice(0, 8)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-white font-mono text-sm tabular-nums">
                    {formatPrice(o.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="relative group">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border ${statusColors[o.status] ?? "bg-gray-500/20 text-gray-400 border-gray-500/20"}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[o.status] ?? "bg-gray-500"} ${o.status === "processing" ? "animate-pulse" : ""}`} />
                        {o.status}
                        <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <div className="absolute top-full left-0 mt-1.5 bg-[#0a0a12] border border-white/10 rounded-xl py-1 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-2xl backdrop-blur-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-3 py-1.5 text-[10px] text-gray-600 uppercase tracking-wider font-medium border-b border-white/5">Change Status</div>
                        {statuses.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(o.id, s)}
                            className={`flex items-center gap-2 w-full text-left px-3 py-2 text-xs capitalize hover:bg-white/[0.04] transition-colors ${
                              s === o.status ? "text-orange-400 bg-orange-500/5" : "text-gray-400"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[s] ?? "bg-gray-500"}`} />
                            {s}
                            {s === o.status && <span className="ml-auto text-[10px] text-orange-500/60">current</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
