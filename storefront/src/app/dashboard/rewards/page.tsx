"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Award, Gift, Star, TrendingUp, History } from "lucide-react";
import { getTier } from "@/lib/types";
import type { RewardTransaction } from "@/lib/types";

export default function RewardsPage() {
  const { user } = useUser();
  const [reward, setReward] = useState<{ points: number; tier: string; total_spent: number } | null>(null);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/rewards?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => {
        setReward(d.reward);
        setTransactions(d.transactions ?? []);
        setLoading(false);
      });
  }, [user?.id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

  const tier = reward ? getTier(reward.total_spent) : getTier(0);
  const nextTier = getTier((reward?.total_spent ?? 0) + 1);
  const nextMin = nextTier.name !== tier.name ? nextTier.min : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Cosmic Rewards</h1>
        <p className="text-sm text-gray-400 mt-1">Earn points, unlock tiers, get rewards</p>
      </div>

      {/* Tier card */}
      <div className="rounded-xl border border-white/5 bg-gradient-to-br from-[#111118] to-[#1a0a2e] p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Current Tier</p>
              <p className={`text-2xl font-bold mt-1 ${tier.color}`}>{tier.name}</p>
            </div>
            <Award className={`w-10 h-10 ${tier.color} opacity-80`} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Cosmic Points</p>
              <p className="text-xl font-bold text-white">{reward?.points ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Spent</p>
              <p className="text-xl font-bold text-white">₹{((reward?.total_spent ?? 0) / 100).toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Next Tier</p>
              <p className="text-sm font-bold text-gray-300">{nextMin ? `₹${(nextMin / 100).toLocaleString("en-IN")}` : "Max"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* How to earn */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
        <h2 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2"><Gift className="w-4 h-4" /> Earn Points</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Sign Up", points: "100", icon: Star },
            { label: "Per ₹100 spent", points: "10", icon: TrendingUp },
            { label: "Write a Review", points: "50", icon: Star },
            { label: "Refer a Friend", points: "200", icon: Gift },
          ].map((e) => (
            <div key={e.label} className="text-center p-3 rounded-lg bg-white/[0.02]">
              <e.icon className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">{e.label}</p>
              <p className="text-sm font-bold text-white">+{e.points}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
        <h2 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2"><History className="w-4 h-4" /> Activity</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No activity yet. Start earning points!</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm text-white capitalize">{t.reason}</p>
                  <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString("en-IN")}</p>
                </div>
                <span className={`text-sm font-mono font-bold ${t.points > 0 ? "text-green-400" : "text-red-400"}`}>
                  {t.points > 0 ? "+" : ""}{t.points}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
