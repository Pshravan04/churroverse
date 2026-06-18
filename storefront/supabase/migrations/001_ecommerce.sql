-- ============================================================
-- CHURROVERSE — Supabase E-Commerce Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Products ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  long_desc   TEXT,
  price       INTEGER NOT NULL,            -- stored in paise (₹ * 100)
  compare_price INTEGER,                   -- original price for discounts
  category    TEXT NOT NULL DEFAULT 'classic',
  emoji       TEXT NOT NULL DEFAULT '🌀',
  stock       INTEGER NOT NULL DEFAULT 100,
  rating      NUMERIC(2,1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  tag         TEXT,                        -- "Best Seller", "New", etc.
  featured    BOOLEAN DEFAULT FALSE,
  images      JSONB DEFAULT '[]'::JSONB,
  metadata    JSONB DEFAULT '{}'::JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Cart Items ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT,                        -- Clerk user ID (null for guests)
  session_id  TEXT,                        -- for guest carts
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id),
  UNIQUE (session_id, product_id)
);

-- ── Wishlists ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wishlists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- ── Orders ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        TEXT UNIQUE NOT NULL,
  user_id             TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled')),
  subtotal            INTEGER NOT NULL,    -- in paise
  shipping            INTEGER DEFAULT 4900,
  total               INTEGER NOT NULL,    -- in paise
  shipping_address    JSONB NOT NULL,
  payment_id          TEXT,               -- Razorpay payment_id
  razorpay_order_id   TEXT,               -- Razorpay order_id
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── Order Items ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id        UUID NOT NULL REFERENCES public.products(id),
  product_name      TEXT NOT NULL,        -- snapshot at time of purchase
  product_emoji     TEXT NOT NULL,
  quantity          INTEGER NOT NULL,
  price_at_purchase INTEGER NOT NULL,     -- in paise
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category  ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured  ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_cart_user_id       ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session_id    ON public.cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id  ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id     ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON public.order_items(order_id);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read
DROP POLICY IF EXISTS "products_public_read" ON public.products;
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (true);

-- Cart: users own their rows (anon key used with user_id string)
DROP POLICY IF EXISTS "cart_select" ON public.cart_items;
CREATE POLICY "cart_select" ON public.cart_items
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "cart_insert" ON public.cart_items;
CREATE POLICY "cart_insert" ON public.cart_items
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "cart_update" ON public.cart_items;
CREATE POLICY "cart_update" ON public.cart_items
  FOR UPDATE USING (true);
DROP POLICY IF EXISTS "cart_delete" ON public.cart_items;
CREATE POLICY "cart_delete" ON public.cart_items
  FOR DELETE USING (true);

-- Wishlists: open via anon key (secured by user_id in app logic)
DROP POLICY IF EXISTS "wishlist_all" ON public.wishlists;
CREATE POLICY "wishlist_all" ON public.wishlists
  FOR ALL USING (true);

-- Orders: open via anon key (secured by user_id in app logic)
DROP POLICY IF EXISTS "orders_all" ON public.orders;
CREATE POLICY "orders_all" ON public.orders
  FOR ALL USING (true);

DROP POLICY IF EXISTS "order_items_all" ON public.order_items;
CREATE POLICY "order_items_all" ON public.order_items
  FOR ALL USING (true);

-- ── Seed Products ────────────────────────────────────────────
INSERT INTO public.products (slug, name, description, long_desc, price, compare_price, category, emoji, stock, rating, review_count, tag, featured)
VALUES
  ('cosmic-churro-classic', 'Cosmic Churro Classic', 'Cinnamon-dusted spirals with caramel filling.', 'The OG Churroverse experience. Hand-rolled dough, deep-fried in pure sunflower oil, coated in our proprietary cinnamon-sugar blend, and filled with a slow-cooked caramel cream that flows like a nebula.', 24900, 29900, 'classic', '🌀', 150, 4.9, 512, 'Best Seller', TRUE),
  ('dark-matter-chocolate', 'Dark Matter Chocolate', '70% dark chocolate ganache, intense and rich.', 'Forged in the deep darkness between galaxies. A 70% single-origin dark chocolate ganache is piped into our signature churro shell, topped with a mirror glaze of cocoa and stardust.', 29900, NULL, 'chocolate', '🍫', 80, 4.8, 320, 'New', TRUE),
  ('stardust-biscoff', 'Stardust Biscoff', 'Belgian Biscoff cream swirled through crunchy dough.', 'Imported Belgian speculoos cookies are ground into a velvety cream and piped warm into a perfectly crispy churro shell. Dusted with crushed Biscoff crumble for maximum crunch.', 27900, NULL, 'biscoff', '⭐', 120, 4.9, 218, 'Fan Fav', TRUE),
  ('nebula-nutella', 'Nebula Nutella', 'Creamy Nutella center with a crispy outer shell.', 'Velvety Ferrero Nutella piped generously into our signature spiral, with a chocolate-hazelnut glaze finish that shines like a nebula at midnight.', 28900, NULL, 'nutella', '🌌', 100, 4.7, 312, NULL, FALSE),
  ('solar-strawberry', 'Solar Strawberry', 'Fresh strawberry compote meets cinnamon pastry.', 'House-made strawberry compote, simmered with vanilla and lemon zest, piped into our crispy spiral. Topped with freeze-dried strawberry dust for an explosive flavor finish.', 25900, NULL, 'strawberry', '🍓', 90, 4.8, 189, NULL, FALSE),
  ('orion-oreo-blast', 'Orion Oreo Blast', 'Crushed Oreo bits baked into every layer.', 'Every layer of this churro is loaded with crushed Oreo crumbs. Filled with cookies-and-cream cream, finished with white chocolate drizzle and whole Oreo pieces.', 31900, 34900, 'chocolate', '🪐', 60, 5.0, 156, 'Limited', FALSE),
  ('galaxy-caramel', 'Galaxy Caramel', 'Salted caramel ribbons through every bite.', 'Artisanal salted caramel sauce, made in small batches with French fleur de sel, ribboned through the dough before frying. A perfect balance of sweet and savory.', 26900, NULL, 'classic', '✨', 110, 4.7, 445, NULL, FALSE),
  ('supernova-speculoos', 'Supernova Speculoos', 'Double speculoos cream, explosive flavor profile.', 'Double-loaded speculoos — both blended into the dough and piped as a warm cream filling. Finished with whole speculoos cookie crumble and a caramel glaze.', 30900, NULL, 'biscoff', '💫', 75, 4.9, 97, 'New', FALSE),
  ('pulsar-pistachio', 'Pulsar Pistachio', 'Iranian pistachio paste, rosewater glaze.', 'Premium Iranian pistachios, stone-ground into a silky paste and combined with rosewater essence. Finished with crushed pistachios and a delicate floral glaze.', 32900, NULL, 'special', '🌿', 50, 4.8, 78, 'Premium', FALSE)
ON CONFLICT (slug) DO NOTHING;
