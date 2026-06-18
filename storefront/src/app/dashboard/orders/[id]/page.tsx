"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Package, XCircle } from "lucide-react";
import type { Order, TrackingEvent } from "@/lib/types";
import { formatPrice, TRACKING_STAGES } from "@/lib/types";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isLoaded || !userId) return;
    Promise.all([
      fetch(`/api/orders/${id}`).then((r) => r.json()),
      fetch(`/api/orders/${id}/tracking`).then((r) => r.json()),
    ]).then(([oData, tData]) => {
      setOrder(oData.order ?? null);
      setEvents(tData.events ?? []);
      setLoading(false);
    });
  }, [id, userId, isLoaded]);

  const cancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    await fetch(`/api/orders/${id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Cancelled by customer" }),
    });
    setCancelling(false);
    const res = await fetch(`/api/orders/${id}`);
    setOrder((await res.json()).order ?? null);
  };

  if (!isLoaded || loading) return <div className="flex items-center justify-center h-64"><div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <div className="text-center py-16 text-gray-500"><Package className="w-10 h-10 mx-auto mb-3 opacity-50" /><p className="text-sm">Order not found</p></div>;

  const canCancel = order.status === "pending" || order.status === "paid";
  const currentIdx = TRACKING_STAGES.findIndex((s) => s.status === order.status);

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{order.order_number}</h1>
          <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          <span className={`inline-block mt-2 text-xs font-medium capitalize px-2.5 py-1 rounded-full ${
            order.status === "delivered" ? "bg-green-500/20 text-green-400" :
            order.status === "cancelled" ? "bg-red-500/20 text-red-400" :
            "bg-orange-500/20 text-orange-400"
          }`}>{order.status}</span>
        </div>
        {canCancel && (
          <button
            onClick={cancelOrder}
            disabled={cancelling}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>

      {/* Tracking timeline */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
        <h2 className="text-sm font-medium text-gray-400 mb-5">Tracking</h2>
        <div className="relative">
          {TRACKING_STAGES.map((stage, i) => {
            const done = i <= currentIdx;
            const isLast = i === TRACKING_STAGES.length - 1;
            const event = events.find((e) => e.status === stage.status);
            return (
              <div key={stage.status} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${done ? "bg-orange-600 text-white" : "bg-white/5 text-gray-500"}`}>
                    {stage.icon}
                  </div>
                  {!isLast && <div className={`w-0.5 flex-1 mt-1 ${done ? "bg-orange-600/50" : "bg-white/5"}`} />}
                </div>
                <div className="pt-1">
                  <p className={`text-sm font-medium ${done ? "text-white" : "text-gray-500"}`}>{stage.label}</p>
                  {event && <p className="text-xs text-gray-500 mt-0.5">{new Date(event.created_at).toLocaleString("en-IN")}</p>}
                </div>
              </div>
            );
          })}
          {order.status === "cancelled" && (
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-red-600 text-white">✕</div>
              </div>
              <div className="pt-1">
                <p className="text-sm font-medium text-red-400">Cancelled</p>
                {events.filter((e) => e.status === "cancelled").map((e) => (
                  <p key={e.id} className="text-xs text-gray-500 mt-0.5">{new Date(e.created_at).toLocaleString("en-IN")}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Items</h2>
        <div className="space-y-2">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-white">{item.product_emoji} {item.product_name} × {item.quantity}</span>
              <span className="text-gray-400">{formatPrice(item.price_at_purchase * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between text-white font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
      </div>

      {/* Shipping address */}
      {order.shipping_address && (
        <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-2">Delivery Address</h2>
          <p className="text-white text-sm">{(order.shipping_address as unknown as Record<string, string>).full_name}</p>
          <p className="text-gray-400 text-sm">{(order.shipping_address as unknown as Record<string, string>).line1}</p>
          <p className="text-gray-400 text-sm">{(order.shipping_address as unknown as Record<string, string>).city}, {(order.shipping_address as unknown as Record<string, string>).state} — {(order.shipping_address as unknown as Record<string, string>).pincode}</p>
        </div>
      )}
    </div>
  );
}
