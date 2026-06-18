-- ============================================================
-- CHURROVERSE — Addresses, Reviews, Order Tracking, Rewards
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Addresses ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  line1       TEXT NOT NULL,
  line2       TEXT DEFAULT '',
  city        TEXT NOT NULL,
  state       TEXT NOT NULL,
  pincode     TEXT NOT NULL,
  country     TEXT DEFAULT 'India',
  is_default  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);

-- ── Reviews ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title       TEXT DEFAULT '',
  text        TEXT DEFAULT '',
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, user_id)  -- one review per product per user
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

-- ── Order Tracking Events ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tracking_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  note        TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_order ON public.tracking_events(order_id);

-- ── Rewards Ledger (point transactions) ───────────────────────
CREATE TABLE IF NOT EXISTS public.reward_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL,
  points      INTEGER NOT NULL,
  reason      TEXT NOT NULL,  -- 'signup', 'purchase', 'review', 'referral', 'redeem'
  reference_id TEXT,          -- order_id, review_id, etc.
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reward_tx_user ON public.reward_transactions(user_id);

-- ── RLS ───────────────────────────────────────────────────────
ALTER TABLE public.addresses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "addresses_all" ON public.addresses;
CREATE POLICY "addresses_all" ON public.addresses FOR ALL USING (true);

DROP POLICY IF EXISTS "reviews_all" ON public.reviews;
CREATE POLICY "reviews_all" ON public.reviews FOR ALL USING (true);

DROP POLICY IF EXISTS "tracking_events_all" ON public.tracking_events;
CREATE POLICY "tracking_events_all" ON public.tracking_events FOR ALL USING (true);

DROP POLICY IF EXISTS "reward_tx_all" ON public.reward_transactions;
CREATE POLICY "reward_tx_all" ON public.reward_transactions FOR ALL USING (true);
