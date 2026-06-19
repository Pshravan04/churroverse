"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package, ChevronRight, Loader2, Clock, Radio,
} from "lucide-react";
import type { Order } from "@/lib/types";
import { formatPrice, TRACKING_STAGES } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d } }),
};

const statusColors: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-500/20",
  paid: "text-green-400 bg-green-500/20",
  processing: "text-blue-400 bg-blue-500/20",
  shipped: "text-orange-400 bg-orange-500/20",
  delivered: "text-green-400 bg-green-500/20",
  cancelled: "text-red-400 bg-red-500/20",
};

export default function TrackingPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/orders?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="py-10">
          <p className="text-orange-400 font-mono text-sm uppercase tracking-widest mb-2">
            — Mission Tracker —
          </p>
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6 text-orange-400" />
            <h1 className="text-4xl md:text-5xl font-black text-white">
              Track Orders
            </h1>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {orders.length} mission{orders.length !== 1 ? "s" : ""} in progress
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <motion.div
            custom={0.1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Package className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-white font-bold text-lg">No Missions Yet</p>
            <p className="text-gray-500 text-sm mt-1">Launch your first order to start tracking.</p>
            <Link
              href="/products"
              className="mt-6 inline-flex px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-full transition-colors"
            >
              Browse the Fleet
            </Link>
          </motion.div>
        )}

        {/* Order list */}
        {!loading && orders.length > 0 && (
          <div className="grid gap-5">
            {orders.map((order, idx) => {
              const currentIdx = TRACKING_STAGES.findIndex((s) => s.status === order.status);
              const isCancelled = order.status === "cancelled";
              const sc = statusColors[order.status] ?? "text-gray-400 bg-white/10";
              const itemCount = order.items?.length ?? 0;

              return (
                <motion.div
                  key={order.id}
                  custom={0.1 + idx * 0.05}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="block group border border-white/10 rounded-2xl bg-white/5 p-6 hover:border-orange-500/30 hover:bg-orange-950/10 transition-all"
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                            Mission #{order.order_number}
                          </h3>
                          <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full ${sc}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                          {" · "}
                          {itemCount} item{itemCount !== 1 ? "s" : ""}
                          {" · "}
                          {formatPrice(order.total)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-orange-400 transition-colors flex-shrink-0 mt-1" />
                    </div>

                    {/* Progress timeline */}
                    {!isCancelled ? (
                      <div className="flex items-center gap-1">
                        {TRACKING_STAGES.map((stage, i) => {
                          const done = i <= currentIdx;
                          const isLast = i === TRACKING_STAGES.length - 1;
                          return (
                            <div key={stage.status} className="flex items-center flex-1 last:flex-none">
                              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs transition-all ${
                                done
                                  ? "bg-orange-600 text-white shadow-[0_0_8px_rgba(234,88,12,0.4)]"
                                  : "bg-white/5 text-gray-600"
                              }`}>
                                {done ? "✓" : i + 1}
                              </div>
                              {!isLast && (
                                <div className={`flex-1 h-0.5 mx-1 rounded transition-all ${
                                  done ? "bg-orange-600/60" : "bg-white/10"
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-red-400">
                        <span className="w-7 h-7 rounded-full bg-red-600/20 flex items-center justify-center text-xs">✕</span>
                        <span className="text-xs text-gray-400">Order cancelled</span>
                      </div>
                    )}

                    {/* Stage labels */}
                    {!isCancelled && (
                      <div className="flex items-center gap-1 mt-1.5">
                        {TRACKING_STAGES.map((stage, i) => {
                          const done = i <= currentIdx;
                          const isLast = i === TRACKING_STAGES.length - 1;
                          return (
                            <div key={stage.status} className={`flex-1 last:flex-none ${isLast ? "" : ""}`}>
                              <p className={`text-[10px] font-mono leading-tight ${
                                done ? "text-orange-400/80" : "text-gray-600"
                              }`}>
                                {stage.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
