"use client";

import { useEffect, useState } from "react";
import { Users as UsersIcon, Search } from "lucide-react";
import { formatPrice } from "@/lib/types";
import { motion } from "framer-motion";

interface AdminUser {
  id: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string | null;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
            <UsersIcon className="absolute inset-0 m-auto w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <p className="text-gray-600 text-sm font-mono">Loading customers...</p>
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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <UsersIcon className="w-4 h-4 text-orange-400" />
          </div>
          <h1 className="text-2xl font-black text-white">Customers</h1>
        </div>
        <p className="text-sm text-gray-500 ml-11">{users.length} customers</p>
      </motion.div>

      {/* Stats row */}
      {users.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="rounded-xl border border-white/5 bg-[#0a0a12] p-4">
            <p className="text-xs text-gray-500 font-medium">Total Customers</p>
            <p className="text-xl font-black text-white mt-1 tabular-nums">{users.length}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#0a0a12] p-4">
            <p className="text-xs text-gray-500 font-medium">Avg Orders/Customer</p>
            <p className="text-xl font-black text-white mt-1 tabular-nums">
              {(users.reduce((s, u) => s + u.orderCount, 0) / users.length).toFixed(1)}
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#0a0a12] p-4">
            <p className="text-xs text-gray-500 font-medium">Avg Spend</p>
            <p className="text-xl font-black text-white mt-1 tabular-nums font-mono">
              {formatPrice(Math.round(users.reduce((s, u) => s + u.totalSpent, 0) / users.length))}
            </p>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <motion.div
        className="relative max-w-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by user ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0a0a12] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-600/50 transition-colors"
        />
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
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">User ID</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Orders</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Total Spent</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-500">
                    <UsersIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No users found</p>
                    <p className="text-xs text-gray-600 mt-1">Try adjusting your search</p>
                  </td>
                </tr>
              )}
              {filtered.map((u, i) => (
                <motion.tr
                  key={u.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-[10px] font-bold text-white">
                        {(u.id[0] ?? "?").toUpperCase()}
                      </div>
                      <span className="text-white font-mono text-xs">{u.id.slice(0, 12)}...</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-white font-mono text-sm tabular-nums">{u.orderCount}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-white font-mono text-sm tabular-nums">
                    {formatPrice(u.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-gray-500 text-xs hidden sm:table-cell font-mono">
                    {u.lastOrder
                      ? new Date(u.lastOrder).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : "—"}
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
