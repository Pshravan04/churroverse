-- ============================================================
-- CHURROVERSE — Admin & Discount Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Discount Codes ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT UNIQUE NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value         INTEGER NOT NULL,           -- percentage (e.g. 10) or fixed amount in paise
  min_cart_value INTEGER DEFAULT 0,         -- minimum cart subtotal in paise
  max_uses      INTEGER,                    -- NULL = unlimited
  used_count    INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  expires_at    TIMESTAMPTZ,
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Rewards / Loyalty Points ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rewards (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL UNIQUE,
  points        INTEGER DEFAULT 0,
  tier          TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  total_spent   INTEGER DEFAULT 0,           -- in paise
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id   ON public.rewards(user_id);

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards         ENABLE ROW LEVEL SECURITY;

-- Admin-level access via anon key (secured by app logic)
CREATE POLICY "discount_codes_all" ON public.discount_codes FOR ALL USING (true);
CREATE POLICY "rewards_all"        ON public.rewards         FOR ALL USING (true);
