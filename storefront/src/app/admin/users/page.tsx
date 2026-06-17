"use client";

import { useEffect, useState } from "react";
import { Users as UsersIcon, Search } from "lucide-react";
import { formatPrice } from "@/lib/types";

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
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-sm text-gray-400 mt-1">{users.length} customers</p>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by user ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111118] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-600/50"
        />
      </div>

      <div className="rounded-xl border border-white/5 bg-[#111118] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">User ID</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Orders</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Total Spent</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    <UsersIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No users found
                  </td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-white font-mono text-xs">{u.id}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-white">{u.orderCount}</td>
                  <td className="py-3 px-4 text-right text-white font-mono">
                    {formatPrice(u.totalSpent)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-400 text-xs hidden sm:table-cell">
                    {u.lastOrder
                      ? new Date(u.lastOrder).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : "—"}
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
