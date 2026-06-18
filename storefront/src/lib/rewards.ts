import { supabase } from './supabase';
import type { RewardTransaction } from './types';
import { getTier } from './types';

const POINTS = {
  signup: 100,
  purchase: 10,   // per ₹100 spent
  review: 50,
  referral: 200,
};

export async function getReward(userId: string) {
  const { data } = await supabase
    .from('rewards')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return data ?? null;
}

export async function getTransactions(userId: string): Promise<RewardTransaction[]> {
  const { data } = await supabase
    .from('reward_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  return (data ?? []) as RewardTransaction[];
}

export async function awardPoints(
  userId: string,
  reason: RewardTransaction['reason'],
  points: number,
  referenceId?: string,
) {
  const { error: txError } = await supabase.from('reward_transactions').insert({
    user_id: userId,
    points,
    reason,
    reference_id: referenceId ?? null,
  });
  if (txError) throw new Error(txError.message);

  const existing = await getReward(userId);
  if (existing) {
    await supabase
      .from('rewards')
      .update({
        points: existing.points + points,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
  } else {
    await supabase.from('rewards').insert({
      user_id: userId,
      points,
      tier: 'explorer',
      total_spent: 0,
    });
  }
}

export async function updateSpent(userId: string, amountPaise: number) {
  const existing = await getReward(userId);
  const totalSpent = (existing?.total_spent ?? 0) + amountPaise;
  const points = Math.floor(amountPaise / 10000) * POINTS.purchase; // 10 pts per ₹100

  if (existing) {
    const tier = getTier(totalSpent).name.toLowerCase();
    await supabase
      .from('rewards')
      .update({
        total_spent: totalSpent,
        points: existing.points + points,
        tier,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
  } else {
    const tier = getTier(totalSpent).name.toLowerCase();
    await supabase.from('rewards').insert({
      user_id: userId,
      points,
      tier,
      total_spent: totalSpent,
    });
  }

  if (points > 0) {
    await supabase.from('reward_transactions').insert({
      user_id: userId,
      points,
      reason: 'purchase',
      reference_id: null,
    });
  }
}
