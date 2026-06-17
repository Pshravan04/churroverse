"use client";

import { useEffect, useState, useCallback } from "react";
import { Tags, Plus, Edit3, Trash2, X } from "lucide-react";
import type { DiscountCode } from "@/lib/admin";

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
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Discount Codes</h1>
          <p className="text-sm text-gray-400 mt-1">{discounts.length} codes</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Code
        </button>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#111118] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Code</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Value</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">Used</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Status</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    <Tags className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No discount codes yet
                  </td>
                </tr>
              )}
              {discounts.map((d) => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-orange-400 font-mono font-bold text-xs uppercase">{d.code}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 capitalize">{d.type}</td>
                  <td className="py-3 px-4 text-right text-white font-mono">
                    {d.type === "percentage" ? `${d.value}%` : `₹${d.value}`}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-400 hidden sm:table-cell">
                    {d.used_count}{d.max_uses ? ` / ${d.max_uses}` : ""}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {!d.is_active ? (
                      <span className="text-red-400 text-xs">Inactive</span>
                    ) : isExpired(d.expires_at) ? (
                      <span className="text-yellow-400 text-xs">Expired</span>
                    ) : (
                      <span className="text-green-400 text-xs">Active</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(d)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <div className="relative bg-[#111118] border border-white/10 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Edit Discount" : "Add Discount"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-600/50 uppercase"
                  placeholder="SAVE20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1 block">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}
                    className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1 block">
                    {form.type === "percentage" ? "Percentage" : "Amount (paise)"}
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                    className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-600/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1 block">Min Cart Value (paise)</label>
                  <input
                    type="number"
                    value={form.min_cart_value}
                    onChange={(e) => setForm({ ...form, min_cart_value: Number(e.target.value) })}
                    className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-600/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1 block">Max Uses</label>
                  <input
                    type="number"
                    value={form.max_uses ?? ""}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value ? Number(e.target.value) : null })}
                    className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-600/50"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">Expires At</label>
                <input
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-600/50"
                  placeholder="20% off on all classic churros"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="accent-orange-600"
                />
                <span className="text-sm text-gray-300">Active</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.code || !form.value}
                className="px-4 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
