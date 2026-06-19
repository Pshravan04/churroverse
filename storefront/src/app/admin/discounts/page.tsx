"use client";

import { useEffect, useState, useCallback } from "react";
import { Tags, Plus, Edit3, Trash2, X } from "lucide-react";
import type { DiscountCode } from "@/lib/admin";
import { motion } from "framer-motion";

interface DiscountForm {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_cart_value: number;
  max_uses: number | null;
  is_active: boolean;
  expires_at: string;
  description: string;
}

const emptyForm: DiscountForm = {
  code: "",
  type: "percentage",
  value: 10,
  min_cart_value: 0,
  max_uses: null,
  is_active: true,
  expires_at: "",
  description: "",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const rowItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DiscountForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchDiscounts = useCallback(async () => {
    const res = await fetch("/api/admin/discounts");
    const data = await res.json();
    setDiscounts(data.discounts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDiscounts(); }, [fetchDiscounts]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (d: DiscountCode) => {
    setForm({
      code: d.code,
      type: d.type,
      value: d.value,
      min_cart_value: d.min_cart_value,
      max_uses: d.max_uses,
      is_active: d.is_active,
      expires_at: d.expires_at ?? "",
      description: d.description ?? "",
    });
    setEditingId(d.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        value: Number(form.value),
        min_cart_value: Number(form.min_cart_value),
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
      };

      if (editingId) {
        await fetch("/api/admin/discounts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        await fetch("/api/admin/discounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await fetchDiscounts();
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this discount code?")) return;
    await fetch(`/api/admin/discounts?id=${id}`, { method: "DELETE" });
    await fetchDiscounts();
  };

  const isExpired = (expires_at: string | null) => {
    if (!expires_at) return false;
    return new Date(expires_at) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
            <Tags className="absolute inset-0 m-auto w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <p className="text-gray-600 text-sm font-mono">Loading discounts...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div className="flex items-center justify-between" variants={rowItem}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Tags className="w-4 h-4 text-yellow-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Discount Codes</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">{discounts.length} codes</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_25px_rgba(234,88,12,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Add Code
        </motion.button>
      </motion.div>

      {/* Table */}
      <motion.div
        className="rounded-xl border border-white/5 bg-[#0a0a12] overflow-hidden"
        variants={rowItem}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Code</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Type</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Value</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Used</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500">
                    <Tags className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No discount codes yet</p>
                    <p className="text-xs text-gray-600 mt-1">Create your first discount to start promoting</p>
                  </td>
                </tr>
              )}
              {discounts.map((d, i) => (
                <motion.tr
                  key={d.id}
                  variants={rowItem}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono font-bold text-xs uppercase tracking-wider">
                      <Tags className="w-3 h-3" />
                      {d.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 capitalize text-xs font-medium">{d.type}</td>
                  <td className="py-3.5 px-4 text-right text-white font-mono text-sm tabular-nums">
                    {d.type === "percentage" ? `${d.value}%` : `₹${d.value}`}
                  </td>
                  <td className="py-3.5 px-4 text-right text-gray-500 hidden sm:table-cell text-xs font-mono">
                    {d.used_count ?? 0}{d.max_uses ? ` / ${d.max_uses}` : " ∞"}
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    {!d.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <span className="w-1 h-1 rounded-full bg-red-400" />
                        Inactive
                      </span>
                    ) : isExpired(d.expires_at) ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        <span className="w-1 h-1 rounded-full bg-yellow-400" />
                        Expired
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        <span className="w-1 h-1 rounded-full bg-green-400" />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEdit(d)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(d.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/[0.06] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative bg-[#0a0a12] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6"
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Edit Discount" : "Add Discount"}
              </h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors uppercase tracking-wider font-mono"
                  placeholder="SAVE20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}
                    className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-600/50 transition-colors"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">
                    {form.type === "percentage" ? "Percent Off" : "Amount (paise)"}
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                    className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Min Cart (paise)</label>
                  <input
                    type="number"
                    value={form.min_cart_value}
                    onChange={(e) => setForm({ ...form, min_cart_value: Number(e.target.value) })}
                    className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Max Uses</label>
                  <input
                    type="number"
                    value={form.max_uses ?? ""}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value ? Number(e.target.value) : null })}
                    className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Expires At</label>
                <input
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-600/50 transition-colors [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                  placeholder="20% off on all classic churros"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.is_active ? "bg-orange-600 border-orange-600" : "border-gray-600 group-hover:border-gray-500"}`}>
                  {form.is_active && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="sr-only"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Active</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm text-gray-500 hover:text-white transition-colors rounded-xl hover:bg-white/[0.04]"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving || !form.code || !form.value}
                className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_25px_rgba(234,88,12,0.4)]"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
