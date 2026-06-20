# CHURROVERSE — Complete Codebase Reference

> **Purpose:** This document is the single source of truth for Claude to understand the entire Churroverse e-commerce website. Read this before making any changes or redesigns.
>
> **Stack:** Next.js 16.2.9 (Turbopack) | React 19.2.4 | Tailwind CSS v4 | framer-motion v12 | Zustand | Clerk | Supabase | Razorpay | Three.js/R3F

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Route Map (Every File)](#2-route-map)
3. [Data Flow Architecture](#3-data-flow-architecture)
4. [Database Schema](#4-database-schema)
5. [API Routes Reference](#5-api-routes-reference)
6. [Component Hierarchy](#6-component-hierarchy)
7. [State Management](#7-state-management)
8. [Design System & Tokens](#8-design-system--tokens)
9. [Key Implementation Patterns](#9-key-implementation-patterns)
10. [Admin Panel](#10-admin-panel)
11. [Styling & Animation Conventions](#11-styling--animation-conventions)
12. [Environment Variables](#12-environment-variables)
13. [Redesign Notes & Constraints](#13-redesign-notes--constraints)

---

## 1. Project Structure

```
storefront/
├── src/
│   ├── app/                         # Next.js App Router pages & API
│   │   ├── layout.tsx               # Root layout: Clerk + GlobalCanvas + Header + AppShell
│   │   ├── page.tsx                 # Homepage (7 sections, space theme)
│   │   ├── globals.css              # Tailwind v4 config + design tokens
│   │   ├── proxy.ts                 # (empty/inactive)
│   │   ├── favicon.ico
│   │   ├── about/page.tsx           # About page
│   │   ├── cart/page.tsx            # Cart page (Zustand-based)
│   │   ├── checkout/page.tsx        # Multi-step checkout (review→shipping→pay)
│   │   ├── contact/page.tsx         # Contact form
│   │   ├── login/page.tsx           # Clerk sign-in
│   │   ├── register/page.tsx        # Clerk sign-up
│   │   ├── profile/page.tsx         # User profile (Clerk + stats)
│   │   ├── products/page.tsx        # Product listing (search, filter, sort)
│   │   ├── products/[id]/page.tsx   # Product detail + reviews
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # Dashboard (overview, orders, wishlist, settings)
│   │   │   ├── addresses/page.tsx   # Address management
│   │   │   ├── orders/[id]/page.tsx # Order detail + tracking
│   │   │   ├── tracking/page.tsx    # All orders timeline view
│   │   │   └── rewards/page.tsx     # DELETED (no file)
│   │   ├── admin/
│   │   │   ├── layout.tsx           # Admin shell (sidebar, mobile, auth gate)
│   │   │   ├── page.tsx             # Admin dashboard (KPIs, charts)
│   │   │   ├── products/page.tsx    # Product CRUD
│   │   │   ├── orders/page.tsx      # Order management
│   │   │   ├── users/page.tsx       # User analytics
│   │   │   ├── discounts/page.tsx   # Discount code CRUD
│   │   │   ├── analytics/page.tsx   # Advanced analytics
│   │   │   └── */loading.tsx        # Loading skeletons per route
│   │   └── api/                     # 23 API route files
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── GlobalCanvas.tsx     # Persistent Three.js canvas (z-[-1])
│   │   │   ├── PlaceholderChurroPlanet.tsx  # Animated planet with rings
│   │   │   ├── StarField.tsx        # 3000-particle star system
│   │   │   └── UFOFleet.tsx         # 3 orbiting UFOs
│   │   ├── layout/
│   │   │   ├── AppShell.tsx         # Loading screen → fade-in children
│   │   │   ├── Header.tsx           # Main site header (nav, cart, auth)
│   │   │   ├── HeaderAuth.tsx       # Clerk conditional auth UI
│   │   │   └── LoadingScreen.tsx    # Full-screen space loading animation
│   │   └── ui/
│   │       ├── button.tsx           # Shadcn button (CVA-based)
│   │       ├── AddToCartButton.tsx  # Animated add-to-cart
│   │       ├── CartDrawer.tsx       # Slide-in cart drawer
│   │       ├── WishlistButton.tsx   # Heart toggle button
│   │       └── AutocompleteInput.tsx # City/state autocomplete
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client singleton
│   │   ├── types.ts                # All TypeScript types + helpers
│   │   ├── products.ts             # Product data access (server)
│   │   ├── cart.ts                 # Cart CRUD
│   │   ├── orders.ts               # Order CRUD + creation
│   │   ├── addresses.ts            # Address CRUD
│   │   ├── reviews.ts              # Review CRUD
│   │   ├── wishlist.ts             # Wishlist CRUD
│   │   ├── tracking.ts             # Tracking events CRUD
│   │   ├── rewards.ts              # Rewards + points system
│   │   ├── admin.ts                # Admin CRUD + analytics
│   │   ├── india-places.ts         # Indian cities/states dataset
│   │   └── utils.ts                # cn() utility
│   └── store/
│       ├── useCartStore.ts          # Zustand cart (persisted)
│       └── useWishlistStore.ts      # Zustand wishlist (DB-backed)
├── supabase/migrations/
│   ├── 001_ecommerce.sql           # Core tables (products, cart, orders)
│   ├── 002_admin.sql               # Admin tables (discounts, rewards, admin)
│   ├── 003_analytics_rpc.sql       # get_admin_analytics() RPC
│   ├── 004_addresses_reviews_tracking.sql  # Address, review, tracking tables
│   └── 005_products_catalog.sql    # 47 sample products (NOT YET RUN ON PROD)
├── package.json
├── postcss.config.mjs
├── next.config.ts
├── tsconfig.json
└── AGENTS.md                       # Custom rules for Claude
```

---

## 2. Route Map

### Public Pages
| Route | File | Type | Description |
|-------|------|------|-------------|
| `/` | `page.tsx` | Client | Homepage: hero, featured, planets, best sellers, timeline, reviews, newsletter, footer |
| `/products` | `products/page.tsx` | Client | Product grid with search, category pills, sort dropdown, pagination |
| `/products/[id]` | `products/[id]/page.tsx` | Client | Product detail: visual, info, reviews section, review modal |
| `/cart` | `cart/page.tsx` | Client | Cart items with qty controls, summary, promo code input |
| `/checkout` | `checkout/page.tsx` | Client | Multi-step: review → shipping → payment (Razorpay) → success |
| `/about` | `about/page.tsx` | Client | Brand story, values, team |
| `/contact` | `contact/page.tsx` | Client | Contact form with info cards |
| `/login` | `login/page.tsx` | Client | Clerk `<SignIn>` with space-themed appearance |
| `/register` | `register/page.tsx` | Client | Clerk `<SignUp>` with space-themed appearance |
| `/profile` | `profile/page.tsx` | Client | User stats, phone editor, quick links, recent orders, security |

### Auth-Gated Pages
| Route | File | Type | Description |
|-------|------|------|-------------|
| `/dashboard` | `dashboard/page.tsx` | Client | 4-section dashboard (overview, orders, wishlist, settings) |
| `/dashboard/addresses` | `dashboard/addresses/page.tsx` | Client | Address CRUD with city/state autocomplete |
| `/dashboard/orders/[id]` | `dashboard/orders/[id]/page.tsx` | Client | Order detail with 5-stage tracking timeline |
| `/dashboard/tracking` | `dashboard/tracking/page.tsx` | Client | All orders with visual progress timelines |

### Admin Pages (auth-gated by role)
| Route | File | Type | Description |
|-------|------|------|-------------|
| `/admin` | `admin/layout.tsx` | Client | Shell: sidebar nav, mobile overlay, Clerk auth gate |
| `/admin` | `admin/page.tsx` | Client | Dashboard: KPI cards, revenue chart, orders by status, top products |
| `/admin/products` | `admin/products/page.tsx` | Client | Product table + CRUD modal |
| `/admin/orders` | `admin/orders/page.tsx` | Client | Orders table + status dropdown |
| `/admin/users` | `admin/users/page.tsx` | Client | Users table + summary stats |
| `/admin/discounts` | `admin/discounts/page.tsx` | Client | Discount codes table + CRUD modal |
| `/admin/analytics` | `admin/analytics/page.tsx` | Client | Full analytics: KPIs, revenue chart, status bars, top products |

### API Routes
See [Section 5 - API Routes Reference](#5-api-routes-reference)

---

## 3. Data Flow Architecture

```
User Browser                    Next.js Server                Supabase
     │                              │                           │
     │─── fetch("/api/products") ──→│─── supabase.from() ──────→│
     │←──── JSON products ──────────│←────── data ──────────────│
     │                              │                           │
     │─── Clerk UI ────────────────→│─── .env Clerk keys ──────→│ Clerk Cloud
     │←── user session ─────────────│←──── JWT ─────────────────│
     │                              │                           │
     │─── Zustand store (persisted) │                           │
     │    ├─ cart (localStorage)    │                           │
     │    └─ wishlist (DB-backed)   │─── API calls ────────────→│
     │                              │                           │
     │─── Razorpay Checkout ───────→│─── verify payment ───────→│ Razorpay
     │←── payment success ──────────│                           │
```

**Key patterns:**

1. **Pages are `"use client"`** — almost everything is client-side rendered. Data is fetched client-side via `fetch("/api/...")` in `useEffect` calls.
2. **API routes** act as thin wrappers over Supabase queries. No auth middleware on API routes (Clerk auth is checked at page level).
3. **Zustand stores** provide client-side state for cart (persisted to localStorage) and wishlist (synced to DB). Both use optimistic updates.
4. **Server data access** (`lib/products.ts`, etc.) is available but mostly used by API routes. Pages rarely import them directly.
5. **3D canvas** (`GlobalCanvas`) sits at `position: fixed; z-index: -1` below all content. Rendered once in root layout, shared across all pages.

---

## 4. Database Schema

Supabase PostgreSQL — 11 tables across 5 migrations.

### `products`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | `gen_random_uuid()` |
| `slug` | TEXT UNIQUE | URL-friendly name |
| `name` | TEXT | Product display name |
| `description` | TEXT | Short description |
| `long_desc` | TEXT | Detailed description |
| `price` | INTEGER | Price in **paise** (₹ * 100) |
| `compare_price` | INTEGER | Original/MRP in paise |
| `category` | TEXT | One of: churro, shake, iced-tea, waffle, munchies |
| `emoji` | TEXT | Product emoji (e.g. "🌀") |
| `stock` | INTEGER | Inventory count |
| `rating` | REAL | Average rating |
| `review_count` | INTEGER | Number of reviews |
| `tag` | TEXT | Badge text (e.g. "Best Seller") |
| `featured` | BOOLEAN | Show on homepage |
| `images` | JSONB | Array of image URLs |
| `metadata` | JSONB | Arbitrary product metadata |

### `cart_items`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `user_id` | TEXT | Clerk user ID (nullable for guests) |
| `session_id` | TEXT | Guest session ID (nullable for users) |
| `product_id` | UUID FK→products | |
| `quantity` | INTEGER | |
| `created_at` | TIMESTAMPTZ | |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `order_number` | TEXT UNIQUE | e.g. "CV-2026-8892" |
| `user_id` | TEXT | Clerk user ID |
| `status` | TEXT | pending → paid → processing → shipped → delivered / cancelled |
| `subtotal` | INTEGER | Paise |
| `shipping` | INTEGER | Paise (0 or 4900) |
| `total` | INTEGER | Paise |
| `shipping_address` | JSONB | Full address object |
| `payment_id` | TEXT | Razorpay payment ID |
| `razorpay_order_id` | TEXT | Razorpay order ID |
| `notes` | TEXT | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

### `order_items`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `order_id` | UUID FK→orders | |
| `product_id` | UUID FK→products | |
| `product_name` | TEXT | Snapshot at purchase time |
| `product_emoji` | TEXT | Snapshot at purchase time |
| `quantity` | INTEGER | |
| `price_at_purchase` | INTEGER | Paise |

### `wishlists`
| Column | Type |
|--------|------|
| `id` | UUID PK |
| `user_id` | TEXT |
| `product_id` | UUID FK→products |

### `addresses`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `user_id` | TEXT | |
| `full_name`, `phone`, `line1`, `line2`, `city`, `state`, `pincode`, `country` | TEXT | |
| `is_default` | BOOLEAN | |
| `created_at` | TIMESTAMPTZ | |

### `reviews`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `product_id` | UUID FK→products | |
| `user_id` | TEXT | |
| `rating` | INTEGER | 1-5 |
| `title` | TEXT | |
| `text` | TEXT | |
| `image_url` | TEXT | |
| `created_at` | TIMESTAMPTZ | |

### `tracking_events`
| Column | Type |
|--------|------|
| `id` | UUID PK |
| `order_id` | UUID FK→orders |
| `status` | TEXT |
| `note` | TEXT |
| `created_at` | TIMESTAMPTZ |

### `reward_transactions`
| Column | Type |
|--------|------|
| `id` | UUID PK |
| `user_id` | TEXT |
| `points` | INTEGER |
| `reason` | TEXT (signup/purchase/review/referral/redeem) |
| `reference_id` | TEXT |
| `created_at` | TIMESTAMPTZ |

### `rewards`
| Column | Type |
|--------|------|
| `id` | UUID PK |
| `user_id` | TEXT UNIQUE |
| `points` | INTEGER |
| `tier` | TEXT |
| `total_spent` | INTEGER (paise) |
| `created_at`, `updated_at` | TIMESTAMPTZ |

### `discount_codes`
| Column | Type |
|--------|------|
| `id` | UUID PK |
| `code` | TEXT UNIQUE |
| `type` | TEXT (percentage/fixed) |
| `value` | INTEGER |
| `min_cart_value` | INTEGER (paise) |
| `max_uses`, `used_count` | INTEGER |
| `is_active` | BOOLEAN |
| `expires_at` | TIMESTAMPTZ |
| `description` | TEXT |

---

## 5. API Routes Reference

### Products
| Route | Method | Purpose | Response |
|-------|--------|---------|----------|
| `/api/products` | GET | List with ?category, ?search, ?sort | `{ products: Product[] }` |
| `/api/products/[id]` | GET | Single product | `{ product: Product }` / 404 |

### Cart
| Route | Method | Purpose | Body/Query |
|-------|--------|---------|------------|
| `/api/cart` | GET | Get cart items | `?userId=` or `?sessionId=` |
| `/api/cart` | POST | Add to cart | `{ userId?, sessionId?, productId, quantity? }` |
| `/api/cart` | DELETE | Clear cart | `{ userId?, sessionId? }` |
| `/api/cart/[itemId]` | PATCH | Update qty | `{ quantity }` |
| `/api/cart/[itemId]` | DELETE | Remove item | — |

### Orders
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/orders` | GET | List user orders (?userId=) |
| `/api/orders/[id]` | GET | Single order with items |
| `/api/orders/[id]/cancel` | POST | Cancel order (pending/paid only) |
| `/api/orders/[id]/tracking` | GET | Tracking events |

### Checkout
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/checkout/create-order` | POST | Create Razorpay order |
| `/api/checkout/create-supabase-order` | POST | Create order in DB |
| `/api/checkout/verify-payment` | POST | Verify HMAC, mark paid |

### Wishlist
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/wishlist` | GET | List (?userId=) |
| `/api/wishlist` | POST | Add `{ userId, productId }` |
| `/api/wishlist/[productId]` | DELETE | Remove (?userId=) |

### Reviews
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/reviews` | GET | By ?productId, optionally ?userId |
| `/api/reviews` | POST | Create review + award 50pts |

### Addresses
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/addresses` | GET | List (?userId=) |
| `/api/addresses` | POST | Create |
| `/api/addresses/[id]` | PUT | Update |
| `/api/addresses/[id]` | DELETE | Delete |
| `/api/addresses/[id]` | PATCH | Set default |

### Rewards
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/rewards` | GET | Summary + transactions (?userId=) |

### Admin
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/products` | GET/POST/PUT/DELETE | Full CRUD |
| `/api/admin/orders` | GET | All orders with items |
| `/api/admin/orders/[id]` | PATCH | Update status + add tracking |
| `/api/admin/users` | GET | User analytics |
| `/api/admin/discounts` | GET/POST/PUT/DELETE | Full CRUD |
| `/api/admin/analytics` | GET | Full analytics object |

---

## 6. Component Hierarchy

```
RootLayout (server — ClerkProvider + fonts + GlobalCanvas)
└── AppShell (client — loading screen gate)
    └── Header (client — nav, search, cart trigger, auth)
        ├── HeaderAuth (Clerk UserButton / SignInButton)
        ├── CartDrawer (slide-in panel)
        └── [Mobile Menu] (AnimatePresence overlay)
    └── <main> {children}</main>
        ├── HomePage (client — 7 sections: hero, featured, planets,
        │              best sellers, timeline, reviews, newsletter, footer)
        ├── ProductsPage (client — search, filters, grid)
        │   ├── ProductCard (client — image, info, price, buttons)
        │   ├── AddToCartButton (animated)
        │   └── WishlistButton (animated)
        ├── ProductDetailPage (client — visual, info, reviews)
        │   ├── AddToCartButton
        │   ├── WishlistButton
        │   └── ReviewSection (list + modal form)
        ├── CartPage (client — items + summary)
        ├── CheckoutPage (client — multi-step)
        │   └── SavedAddresses (inline component)
        ├── DashboardPage (client — 4 sections)
        ├── ProfilePage (client — stats, phone, orders)
        └── AdminLayout (client — sidebar, auth gate)
            ├── Dashboard / Products / Orders / Users / Discounts / Analytics
            └── [loading.tsx per route]
```

---

## 7. State Management

### Zustand Stores

**`useCartStore`** — persisted to localStorage (`churroverse-cart`)
- **State:** `items: CartItem[]`, `isLoading`, `isSyncing`, `sessionId`
- **Actions:** `syncFromDB(userId)`, `addItem(product, qty, userId)`, `removeItem(itemId)`, `updateQty(itemId, qty)`, `clearCart(userId)`, plus local-only variants (`addItemLocal`, `removeItemLocal`, `updateQtyLocal`)
- **Computed:** `totalItems()`, `totalPrice()`
- **Pattern:** Optimistic update first, then DB sync in background
- **Guest flow:** Local storage with `sessionId`; on login, `mergeGuestCart()` transfers items

**`useWishlistStore`** — not persisted (always DB-backed)
- **State:** `items: WishlistItem[]`, `productIds: Set<string>` (O(1) lookup), `isLoading`
- **Actions:** `syncFromDB(userId)`, `toggle(userId, product)`, `isWishlisted(productId)`
- **Pattern:** Optimistic toggle → DB upsert/delete

### Data Fetching Pattern
```typescript
// Client components fetch via API routes:
const [data, setData] = useState<Type[]>([]);
useEffect(() => {
  fetch("/api/endpoint?param=value")
    .then(r => r.json())
    .then(d => setData(d.data ?? []));
}, [deps]);
```

---

## 8. Design System & Tokens

### Colors (defined in `:root` via Tailwind v4 `@theme`)
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#020010` | Deep space black |
| `--foreground` | `#f8f8ff` | White text |
| `--card` | `#0a0820` | Dark card surface |
| `--primary` | `#ea580c` | Orange (CTAs, accents) |
| `--secondary` | `#1a1040` | Purple-ish secondary |
| `--muted` | `#0f0c30` | Very dark muted |
| `--border` | `rgba(255,255,255,0.1)` | Subtle white borders |
| `--input` | `rgba(255,255,255,0.08)` | Input backgrounds |
| `--ring` | `#ea580c` | Focus ring |

### Typography
| Token | Value |
|-------|-------|
| `--font-sans` | `Outfit, Inter, system-ui, sans-serif` |
| `--font-heading` | `Outfit, system-ui, sans-serif` |
| `--font-mono` | `Geist Mono, Fira Code, monospace` |

### Spacing & Radius
| Token | Value |
|-------|-------|
| `--radius` | `0.75rem` (12px base) |
| `--radius-sm` | `calc(var(--radius) * 0.6)` |
| `--radius-xl` | `calc(var(--radius) * 1.4)` |
| `--radius-2xl` | `calc(var(--radius) * 1.8)` |
| `--radius-3xl` | `calc(var(--radius) * 2.2)` |

### Custom Utilities (in `globals.css`)
- `.glass-card` — `backdrop-filter: blur(12px)` + semi-transparent bg + border
- `.text-glow-orange` — orange text shadow
- `.gradient-text-churro` — yellow→orange→red gradient text
- `.animate-float` — `float` keyframe (yoyo 12px)
- `.animate-pulse-glow` — `pulse-glow` keyframe (box-shadow pulse)

### UI Patterns
| Pattern | Implementation |
|---------|---------------|
| Buttons | `bg-orange-600 hover:bg-orange-500 rounded-full` + shadow glow |
| Cards | `border border-white/10 rounded-2xl bg-white/5` |
| Modals | Fixed overlay `bg-black/60 backdrop-blur-sm` + centered `bg-[#0a0a12] border border-white/10 rounded-2xl` |
| Loading | Spinner: `w-16 h-16 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin` |
| Empty states | Large emoji icon + heading + description + CTA button |
| Inputs | `bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600` |
| Section labels | `text-orange-400 font-mono text-sm uppercase tracking-widest` |
| Headings | `text-4xl md:text-6xl font-black text-white` |

---

## 9. Key Implementation Patterns

### Page Template
```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/endpoint")
      .then(r => r.json())
      .then(d => { setData(d); setIsLoading(false); });
  }, []);

  if (isLoading) return <Spinner />;
  if (!data) return <EmptyState />;

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4">...</div>
    </div>
  );
}
```

### Animation Constants (used across pages)
```tsx
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
```

### Loading State Pattern
```tsx
<div className="flex items-center justify-center py-32">
  <div className="relative">
    <div className="w-16 h-16 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
    <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-orange-400 animate-pulse" />
  </div>
  <p className="text-gray-500 text-sm font-mono">Scanning the nebula...</p>
</div>
```

### Empty State Pattern
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="text-center py-20"
>
  <div className="text-6xl mb-4">🛸</div>
  <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
  <p className="text-gray-500 mb-6">Description here.</p>
  <Button className="bg-orange-600 hover:bg-orange-500 rounded-full">
    Action
  </Button>
</motion.div>
```

### Glassmorphism Card Pattern
```tsx
<div className="border border-white/10 rounded-2xl bg-white/5 hover:border-orange-500/30 transition-all duration-300">
```

### Important: framer-motion v12 Constraint
**`layoutId` and `AnimatePresence` combined with conditionally-rendered `motion.div` elements cause hydration errors** in SSR because framer-motion v12 uses `React.useId()` internally. **Use CSS transitions instead of `AnimatePresence` for SSR-safe animations.** Active indicators should use static `<div>` elements with opacity/visibility toggles, not conditional rendering of motion elements with layoutId.

---

## 10. Admin Panel

**Layout:** Fixed sidebar (64 width) + scrollable main area. Auth gate checks `user.publicMetadata.role === "admin"` or email whitelist.

**Sidebar nav:** Dashboard, Products, Orders, Users, Discounts, Analytics. CSS-only active indicator (orange vertical bar, no layoutId).

**Admin pages share this pattern:**
```tsx
1. Fetch data from /api/admin/* on mount
2. Show loading.tsx skeleton while loading
3. Render table/list with motion stagger animation
4. Inline edit via modal (glassmorphism, spring animation)
5. CRUD actions → API call → re-fetch data
```

**Admin features per page:**
- **Dashboard:** KPI cards (revenue, orders, products, AOV), revenue bar chart (14 days), orders-by-status bar chart, top products (sold qty)
- **Products:** Table (name, emoji, category, price, stock, rating), Add/Edit modal, delete with confirmation
- **Orders:** Table (order number, items, customer name, total, status, date), status dropdown (update), cancel action
- **Users:** Table (user ID, order count, total spent, avg order value, last order), summary stats row
- **Discounts:** Table (code, type, value, status, usage), Add/Edit modal, active/inactive toggle
- **Analytics:** Same KPIs as dashboard + detailed charts + summary grid

---

## 11. Styling & Animation Conventions

### Tailwind v4 (CSS-based config)
- NO `tailwind.config.js` — all config in `globals.css` via `@theme inline {}`
- Custom theme tokens defined as CSS variables in `:root`
- PostCSS via `@tailwindcss/postcss`
- Imports: `@import "tailwindcss"` + `@import "tw-animate-css"` + `@import "shadcn/tailwind.css"`

### Class Naming
- Utility-first Tailwind (no custom CSS classes except for 4 utilities)
- Responsive: `md:`, `lg:` prefixes
- Dark mode via `.dark` class variant (not used — site is always dark)
- Pseudo-classes: `hover:`, `focus:`, `group-hover:`, `group-{modifier}:`

### Motion/Animation Patterns
| Pattern | Where |
|---------|-------|
| `framer-motion` `motion.div` | Page entrance animations (fadeUp, stagger) |
| `framer-motion` `AnimatePresence` | Modals, mobile menus, cart drawer |
| `framer-motion` `whileHover`/`whileTap` | Interactive elements (buttons, cards) |
| CSS transitions (`transition-all duration-300`) | Hover effects, class toggles |
| Data attributes + CSS | Active nav indicator (admin sidebar) |
| CSS keyframes (`animate-float`, `animate-pulse-glow`) | Subtle ambient animations |

---

## 12. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://obnnapaveybgsrzyozmv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public_anon_key>

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<test_key>
CLERK_SECRET_KEY=<test_secret>

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=<test_key>
RAZORPAY_KEY_SECRET=<test_secret>
```

**Notes:**
- Supabase URL does NOT use `db.` subdomain (that's direct Postgres, not REST API)
- Razorpay simulated payment when `NEXT_PUBLIC_RAZORPAY_KEY_ID` is absent
- Admin whitelist: `admin@churroverse.com`, `shravanphutanr@gmail.com`
- All values in `.env.local` are test/development keys

---

## 13. Redesign Notes & Constraints

### What Must Stay
- **Space theme:** Dark background `#020010`, orange primary (`#ea580c`), glassmorphism cards, glow effects
- **3D canvas:** `GlobalCanvas` with StarField + Planet + UFOs (fixed z-index background)
- **Emoji-based product visuals:** Products use emoji strings (stored in DB), not images
- **All existing routes/paths:** Must continue to work (no breaking URL changes)
- **Current DB schema + API contract:** Response shapes must remain compatible
- **Clerk auth:** Login/register flows through Clerk components
- **Paise pricing:** All monetary values in paise (₹ * 100)
- **States in address:** India-specific (states, cities from `india-places.ts`)
- **`"use client"` pattern** for pages (server components not widely used)

### What Can Be Redesigned
- **Visual design:** Layout, spacing, typography, color accents, card styles, button styles
- **Animations:** Can add/change motion patterns (but avoid `layoutId` in SSR)
- **Component structure:** Can extract inline components, create new shared components
- **Navigation:** Site nav structure, mobile menu design
- **Homepage sections:** Can reorder, redesign, add new sections
- **Checkout flow:** Can redesign multi-step UX
- **Admin panel:** Full visual redesign (but keep all CRUD functionality)
- **Loading states:** Can design custom loading.tsx per route
- **Empty states:** Can redesign empty state illustrations

### Known Issues to Fix
- [ ] Migration `005_products_catalog.sql` not yet run on prod — products table empty
- [ ] Razorpay live keys missing in Vercel env vars
- [ ] `dashboard/rewards/page.tsx` was deleted but nav links may still reference it
- [ ] No proper 404 page
- [ ] No sitemap/robots.txt
- [ ] SEO metadata could be richer per-page
- [ ] No real images for products (only emojis)
- [ ] Phone auto-prefix `"+91 "` hardcoded (India-only)

### Performance Considerations
- All pages are `"use client"` — consider adding server components where possible
- 3D canvas runs constantly — could add visibility-based rendering
- No image optimization (products use emojis, no `<Image>` component needed)
- No ISR/SSG — all client-side data fetching
- SWR dependency available but not used
