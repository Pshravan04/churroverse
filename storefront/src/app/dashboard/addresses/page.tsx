"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, MapPin, Edit3, Trash2, Star, X, Navigation, Globe,
  Loader2, Phone, User, ChevronRight
} from "lucide-react";
import type { Address } from "@/lib/types";
import AutocompleteInput from "@/components/ui/AutocompleteInput";
import { searchCities, searchStates, cities } from "@/lib/india-places";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d } }),
};

const emptyForm = {
  full_name: "", phone: "+91 ", line1: "", line2: "",
  city: "", state: "", pincode: "", country: "India", is_default: false,
};

export default function AddressesPage() {
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [stateSuggestions, setStateSuggestions] = useState<string[]>([]);

  const load = async () => {
    if (!user?.id) return;
    try {
      const r = await fetch(`/api/addresses?userId=${user.id}`);
      const d = await r.json();
      setAddresses(d.addresses ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user?.id]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (a: Address) => {
    setForm({
      full_name: a.full_name, phone: a.phone, line1: a.line1,
      line2: a.line2 ?? "", city: a.city, state: a.state,
      pincode: a.pincode, country: a.country, is_default: a.is_default,
    });
    setEditingId(a.id);
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, user_id: user!.id };
      if (editingId) {
        await fetch(`/api/addresses/${editingId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/addresses", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await load();
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    await load();
  };

  const setDefault = async (id: string) => {
    await fetch(`/api/addresses/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "set-default", userId: user!.id }),
    });
    await load();
  };

  // --- Autocomplete handlers ---
  const handleCityChange = (val: string) => {
    setForm({ ...form, city: val });
    const filtered = searchCities(val)
      .filter((c) => !form.state || c.state === form.state)
      .map((c) => c.city);
    setCitySuggestions(filtered);
  };

  const handleCitySelect = (val: string) => {
    setForm({ ...form, city: val });
    setCitySuggestions([]);
    // Auto-fill state from the selected city
    const match = cities.find((c) => c.city === val);
    if (match && match.state !== form.state) {
      setForm((prev) => ({ ...prev, city: val, state: match.state }));
    }
  };

  const handleStateChange = (val: string) => {
    setForm({ ...form, state: val });
    setStateSuggestions(searchStates(val));
  };

  const handleStateSelect = (val: string) => {
    setForm({ ...form, state: val });
    setStateSuggestions([]);
  };

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="py-10">
          <p className="text-orange-400 font-mono text-sm uppercase tracking-widest mb-2">
            — Galactic Coordinates —
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Saved Coordinates
              </h1>
              <p className="text-gray-500 text-sm mt-2 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-orange-400" />
                {addresses.length} planet{addresses.length !== 1 ? "s" : ""} charted
              </p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-full shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] transition-all"
            >
              <Plus className="w-4 h-4" /> Chart New Coordinate
            </button>
          </div>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && addresses.length === 0 && (
          <motion.div
            custom={0.1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-white font-bold text-lg">No Coordinates Charted</p>
            <p className="text-gray-500 text-sm mt-1">Save your first delivery location to get started.</p>
            <button
              onClick={openCreate}
              className="mt-6 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-full transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </motion.div>
        )}

        {/* Address list */}
        {!loading && addresses.length > 0 && (
          <div className="grid gap-4">
            {addresses.map((a, idx) => (
              <motion.div
                key={a.id}
                custom={0.1 + idx * 0.05}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={`group relative rounded-2xl border p-5 transition-all duration-300 ${
                  a.is_default
                    ? "border-orange-500/40 bg-gradient-to-br from-orange-900/15 to-black"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      a.is_default
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-white/5 text-gray-500 group-hover:text-orange-400 transition-colors"
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-bold">{a.full_name}</p>
                        {a.is_default && (
                          <span className="text-[11px] font-mono text-orange-400 bg-orange-600/15 px-2 py-0.5 rounded-full border border-orange-500/20">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
                        {a.line1}{a.line2 ? `, ${a.line2}` : ""}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {a.city}, {a.state} — {a.pincode}
                      </p>
                      {a.phone && (
                        <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {a.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!a.is_default && (
                      <button
                        onClick={() => setDefault(a.id)}
                        className="p-2 rounded-lg text-gray-500 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
                        title="Set as primary"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(a)}
                      className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(a.id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Decorative glow for default */}
                {a.is_default && (
                  <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent pointer-events-none" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-gradient-to-b from-[#1a1020] to-black border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-[0_0_60px_rgba(234,88,12,0.08)]"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {editingId ? "Update Coordinate" : "Chart New Coordinate"}
                    </h2>
                    <p className="text-xs text-gray-500">Enter the delivery location details</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5 flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+919876543210"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">Address Line 1</label>
                  <input
                    value={form.line1}
                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    placeholder="House / Flat / Street"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">Address Line 2</label>
                  <input
                    value={form.line2}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    placeholder="Apartment / Landmark (optional)"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <AutocompleteInput
                      value={form.city}
                      onChange={handleCityChange}
                      onSelect={handleCitySelect}
                      suggestions={citySuggestions}
                      placeholder="City"
                      label="City"
                      icon={<MapPin className="w-3 h-3" />}
                    />
                  </div>
                  <div>
                    <AutocompleteInput
                      value={form.state}
                      onChange={handleStateChange}
                      onSelect={handleStateSelect}
                      suggestions={stateSuggestions}
                      placeholder="State"
                      label="State"
                      icon={<Globe className="w-3 h-3" />}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5">Pincode</label>
                    <input
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      placeholder="Pincode"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3 h-3" /> Country
                    </label>
                    <input
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                    className="accent-orange-500"
                  />
                  Set as primary delivery coordinate
                </label>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-sm text-gray-400 hover:text-white transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving || !form.full_name || !form.line1}
                  className="px-6 py-2.5 text-sm font-bold bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-full transition-colors inline-flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingId ? (
                    <>Update Coordinate <ChevronRight className="w-3 h-3" /></>
                  ) : (
                    <>Chart Coordinate <ChevronRight className="w-3 h-3" /></>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
