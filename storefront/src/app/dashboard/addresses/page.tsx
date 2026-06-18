"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Plus, MapPin, Edit3, Trash2, Star, X } from "lucide-react";
import type { Address } from "@/lib/types";

const emptyForm = { full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", country: "India", is_default: false };

export default function AddressesPage() {
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user?.id) return;
    const r = await fetch(`/api/addresses?userId=${user.id}`);
    const d = await r.json();
    setAddresses(d.addresses ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (a: Address) => {
    setForm({ full_name: a.full_name, phone: a.phone, line1: a.line1, line2: a.line2 ?? "", city: a.city, state: a.state, pincode: a.pincode, country: a.country, is_default: a.is_default });
    setEditingId(a.id);
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, user_id: user!.id };
      if (editingId) {
        await fetch(`/api/addresses/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      await load();
      setShowForm(false);
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    await load();
  };

  const setDefault = async (id: string) => {
    await fetch(`/api/addresses/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "set-default", userId: user!.id }) });
    await load();
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Addresses</h1>
          <p className="text-sm text-gray-400">{addresses.length} saved addresses</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No addresses saved yet</p>
        </div>
      )}

      <div className="grid gap-3">
        {addresses.map((a) => (
          <div key={a.id} className="rounded-xl border border-white/5 bg-[#111118] p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{a.full_name}</p>
                  <p className="text-gray-400 text-sm">{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
                  <p className="text-gray-400 text-sm">{a.city}, {a.state} — {a.pincode}</p>
                  <p className="text-gray-500 text-xs mt-1">{a.phone}</p>
                  {a.is_default && <span className="inline-block mt-1.5 text-[11px] text-orange-400 bg-orange-600/10 px-2 py-0.5 rounded-full">Default</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!a.is_default && <button onClick={() => setDefault(a.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-orange-400 hover:bg-white/5" title="Set default"><Star className="w-4 h-4" /></button>}
                <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => remove(a.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <div className="relative bg-[#111118] border border-white/10 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editingId ? "Edit Address" : "Add Address"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 block mb-1">Full Name</label>
                  <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 block mb-1">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 block mb-1">Address Line 1</label>
                  <input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 block mb-1">Address Line 2</label>
                  <input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">City</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">State</label>
                  <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Pincode</label>
                  <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Country</label>
                  <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full bg-[#0a0820] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600/50" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={save} disabled={saving || !form.full_name || !form.line1} className="px-4 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-lg">{saving ? "Saving..." : editingId ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center h-64"><div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
}
