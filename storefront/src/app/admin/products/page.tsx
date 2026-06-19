"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  X,
} from "lucide-react";
import type { Product } from "@/lib/types";
import type { ProductCategory } from "@/lib/types";
import { motion } from "framer-motion";

const categories: ProductCategory[] = [
  "all", "churro", "shake", "iced-tea", "waffle", "munchies",
];

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  long_desc: string;
  price: number;
  category: string;
  emoji: string;
  stock: number;
  tag: string;
  featured: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  description: "",
  long_desc: "",
  price: 0,
  category: "classic",
  emoji: "🌮",
  stock: 50,
  tag: "",
  featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      long_desc: p.long_desc ?? "",
      price: p.price,
      category: p.category,
      emoji: p.emoji,
      stock: p.stock,
      tag: p.tag ?? "",
      featured: p.featured,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...form, price: Number(form.price) }),
        });
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, price: Number(form.price) }),
        });
      }
      await fetchProducts();
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    await fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
            <Package className="absolute inset-0 m-auto w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <p className="text-gray-600 text-sm font-mono">Loading products...</p>
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
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Package className="w-4 h-4 text-purple-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Products</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">{products.length} products in catalog</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_25px_rgba(234,88,12,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        className="relative max-w-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search products..."
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
        transition={{ delay: 0.1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Product</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Price</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Stock</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-500">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No products found</p>
                    <p className="text-xs text-gray-600 mt-1">Try adjusting your search</p>
                  </td>
                </tr>
              )}
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.emoji}</span>
                      <div>
                        <p className="text-white font-medium text-sm">{p.name}</p>
                        <p className="text-gray-600 text-xs truncate max-w-[200px]">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                    <span className="text-xs capitalize bg-white/[0.04] px-2 py-0.5 rounded-full">{p.category}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-white font-mono text-sm tabular-nums">
                    ₹{(p.price / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell">
                    <span className={`text-xs font-mono ${p.stock <= 10 ? "text-red-400" : "text-gray-500"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(p.id)}
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
            transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
            className="relative bg-[#0a0a12] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Edit Product" : "Add Product"}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                    placeholder="Galactic Churro"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                    placeholder="galactic-churro"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Long Description</label>
                <textarea
                  value={form.long_desc}
                  onChange={(e) => setForm({ ...form, long_desc: e.target.value })}
                  rows={3}
                  className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Price (paise)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Emoji</label>
                  <input
                    type="text"
                    value={form.emoji}
                    onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                    className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-600/50 transition-colors"
                  >
                    {categories.filter((c) => c !== "all").map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Tag</label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    className="w-full bg-[#0a0820]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                    placeholder="Premium"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.featured ? "bg-orange-600 border-orange-600" : "border-gray-600 group-hover:border-gray-500"}`}>
                  {form.featured && (
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
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="sr-only"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Featured product</span>
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
                disabled={saving || !form.name || !form.slug}
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
