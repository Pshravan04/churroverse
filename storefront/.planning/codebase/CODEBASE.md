# Churroverse Storefront — Full Codebase Map

**Analysis Date:** 2026-06-20

## 1. Project Structure

```
storefront/
├── .next/                          # Next.js build output (gitignored)
├── public/                         # Static assets
├── src/
│   ├── app/                        # Next.js App Router pages + API routes
│   │   ├── layout.tsx              # Root layout (ClerkProvider, GlobalCanvas, Header, AppShell)
│   │   ├── globals.css             # Tailwind v4 theme + shadcn/ui + glassmorphism
│   │   ├── page.tsx                # Homepage (featured products, planets, newsletter)
│   │   ├── about/page.tsx          # About page
│   │   ├── contact/page.tsx        # Contact form
│   │   ├── login/page.tsx          # Sign-in (via `<SignIn />`)
│   │   ├── register/page.tsx       # Sign-up (via `<SignUp />`)
│   │   ├── profile/page.tsx        # User profile page
│   │   ├── cart/page.tsx           # Cart page
│   │   ├── checkout/page.tsx       # Checkout flow (address → payment → confirm)
│   │   ├── products/
│   │   │   ├── page.tsx            # Products listing (grid + filters + search)
│   │   │   └── [id]/page.tsx       # Product detail
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Dashboard home (user's orders summary)
│   │   │   ├── addresses/page.tsx  # Saved addresses
│   │   │   ├── tracking/page.tsx   # Order tracking
│   │   │   └── orders/
│   │   │       └── [id]/page.tsx   # Order detail
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin sidebar layout (nav, auth gate)
│   │   │   ├── page.tsx            # Dashboard (KPI cards, revenue chart, order status bars)
│   │   │   ├── loading.tsx         # Loading state
│   │   │   ├── products/
│   │   │   │   ├── page.tsx        # CRUD table + modal form
│   │   │   │   └── loading.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx        # Orders table with status dropdown
│   │   │   │   └── loading.tsx
│   │   │   ├── discounts/
│   │   │   │   ├── page.tsx        # Discounts CRUD table + modal
│   │   │   │   └── loading.tsx
│   │   │   ├── analytics/
│   │   │   │   ├── page.tsx        # Deep-dive analytics (KPIs, charts, top products)
│   │   │   │   └── loading.tsx
│   │   │   └── users/
│   │   │       ├── page.tsx        # Customers list (derived from orders)
│   │   │       └── loading.tsx
│   │   └── api/
│   │       ├── products/
│   │       │   ├── route.ts        # GET (list with filters/sort)
│   │       │   └── [id]/route.ts   # GET (single product)
│   │       ├── cart/
│   │       │   ├── route.ts        # GET, POST (add item)
│   │       │   └── [itemId]/route.ts # DELETE (remove item)
│   │       ├── checkout/
│   │       │   ├── create-order/route.ts        # Razorpay order creation
│   │       │   ├── create-supabase-order/route.ts # DB order creation after payment
│   │       │   └── verify-payment/route.ts      # Razorpay signature verification
│   │       ├── addresses/
│   │       │   ├── route.ts        # GET, POST
│   │       │   └── [id]/route.ts   # PUT, DELETE, PATCH (set default)
│   │       ├── orders/
│   │       │   ├── route.ts        # GET (user's orders)
│   │       │   ├── [id]/route.ts   # GET (order detail)
│   │       │   ├── [id]/tracking/route.ts  # GET (tracking events)
│   │       │   └── [id]/cancel/route.ts    # POST (cancel)
│   │       ├── reviews/
│   │       │   └── route.ts        # GET, POST
│   │       ├── wishlist/
│   │       │   ├── route.ts        # GET, POST
│   │       │   └── [productId]/route.ts # DELETE
│   │       ├── rewards/
│   │       │   └── route.ts        # GET (user rewards balance + history)
│   │       └── admin/
│   │           ├── analytics/route.ts  # GET (aggregated store stats)
│   │           ├── products/route.ts   # GET, POST, PUT, DELETE
│   │           ├── orders/route.ts     # GET (all orders)
│   │           ├── orders/[id]/route.ts # PATCH (update status)
│   │           ├── discounts/route.ts  # GET, POST, PUT, DELETE
│   │           └── users/route.ts     # GET (derived user list)
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── GlobalCanvas.tsx     # Shared R3F canvas with Drei, fixed z-[-1]
│   │   │   ├── StarField.tsx        # Animated star particles
│   │   │   ├── PlaceholderChurroPlanet.tsx # Rotating torus planet
│   │   │   └── UFOFleet.tsx         # Floating UFO group animation
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Sticky nav with logo, search, cart/wishlist icons, Clerk auth
│   │   │   ├── HeaderAuth.tsx       # Clerk UserButton wrapper
│   │   │   ├── AppShell.tsx         # Page wrapper with padding, max-width
│   │   │   └── LoadingScreen.tsx    # Fullscreen rocket-spinner loader
│   │   └── ui/
│   │       ├── button.tsx           # shadcn button (base-nova style)
│   │       ├── AddToCartButton.tsx  # Animated add-to-cart with feedback
│   │       ├── CartDrawer.tsx       # Slide-out cart drawer with items + checkout CTA
│   │       ├── WishlistButton.tsx   # Heart toggle for wishlist
│   │       └── AutocompleteInput.tsx # Address autocomplete for Indian cities
│   ├── store/
│   │   ├── useCartStore.ts          # Zustand cart (persist + localStorage)
│   │   └── useWishlistStore.ts      # Zustand wishlist (persist + localStorage)
│   └── lib/
│       ├── supabase.ts              # Supabase client singleton
│       ├── types.ts                 # All TypeScript types + ProductCategory + formatPrice()
│       ├── utils.ts                 # cn() helper, formatDate()
│       ├── products.ts              # getProductById(), getProductsByCategory()
│       ├── cart.ts                  # getCart(), addToCart(), removeFromCart()
│       ├── orders.ts                # createOrder(), getUserOrders(), getOrderById()
│       ├── checkout.ts              # (not a file — logic spread across API routes)
│       ├── addresses.ts             # Address CRUD helpers
│       ├── reviews.ts               # Review helpers
│       ├── wishlist.ts              # Wishlist helpers
│       ├── rewards.ts               # Rewards balance + history helpers
│       ├── tracking.ts              # Tracking event helpers
│       ├── admin.ts                 # Admin analytics, products, orders, discounts, users
│       └── india-places.ts          # Static cities/states data for address autocomplete
├── next.config.ts                   # Turbopack, transpilePackages for three/drei/r3f
├── tsconfig.json                    # Path aliases: @/ → src/
├── components.json                  # shadcn config (base-nova style, Tailwind v4)
├── package.json                     # Dependencies (see Stack section)
├── AGENTS.md                        # Next.js compatibility notes
└── .gitignore                       # node_modules, .next, .env, .vercel
```

---

## 2. Technology Stack

### Core

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | ^16.2.9 | App Router, API routes, Turbopack |
| Language | TypeScript | ^5 | All code |
| Styling | Tailwind CSS | ^4.1.4 | Utility-first CSS with v4 API |
| Animation | Framer Motion | ^12.9.2 | Page/component animations |
| 3D | React Three Fiber | ^9.1.2 | WebGL canvas components |
| 3D Drei | @react-three/drei | ^10 | R3F helpers (OrbitControls, etc.) |
| 3D Engine | three | ^0.176 | Underlying WebGL library |
| State | Zustand | ^5.0.4 | Cart + wishlist stores with persist |
| Auth | Clerk | ^6.12.12 | Authentication + user management |
| Payments | Razorpay | ^2.0.4 | Payment gateway integration |
| Database | Supabase JS | ^2.49.4 | PostgreSQL client |

### UI Component Libraries

| Package | Version | Purpose |
|---------|---------|---------|
| @base-ui/react | ^1.2.1 | Low-level primitives (shadcn peer dep) |
| shadcn/ui | via components.json | Button (base-nova style) |
| lucide-react | ^0.510 | Icon set |
| class-variance-authority | ^0.7.1 | Variant management for shadcn |
| clsx + tailwind-merge | via utils.ts | cn() utility |
| tailwindcss-animate | ^1.0.7 | Animation utilities |

### Dev/Build

| Tool | Version | Purpose |
|------|---------|---------|
| TypeScript | ^5 | Type checking |
| @types/three | ^0.176 | Three.js type definitions |
| PostCSS | ^8 | CSS processing |
| Turbopack | (Next.js 16) | Dev server + builds |

### Key Next.js Config (`next.config.ts`)

```ts
const nextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};
export default withSerwist(nextConfig);
// Wrapped with @serwist/next for service worker / PWA support
```

---

## 3. Routing Structure

### Pages (20 routes)

| Route | File | Purpose | Auth Required | `"use client"` |
|-------|------|---------|:---:|:---:|
| `/` | `src/app/page.tsx` | Homepage: hero, featured products, planets section, newsletter | No | Yes |
| `/products` | `src/app/products/page.tsx` | Product grid with category/price search/sort filters | No | Yes |
| `/products/[id]` | `src/app/products/[id]/page.tsx` | Product detail with reviews, add-to-cart | No | Yes |
| `/cart` | `src/app/cart/page.tsx` | Full cart with quantity controls, subtotal | No | Yes |
| `/checkout` | `src/app/checkout/page.tsx` | Multi-step: address → payment → confirmation | Yes | Yes |
| `/dashboard` | `src/app/dashboard/page.tsx` | User dashboard: order history summary | Yes | Yes |
| `/dashboard/orders/[id]` | `src/app/dashboard/orders/[id]/page.tsx` | Single order detail with timeline | Yes | Yes |
| `/dashboard/tracking` | `src/app/dashboard/tracking/page.tsx` | Search orders by tracking number | Yes | Yes |
| `/dashboard/addresses` | `src/app/dashboard/addresses/page.tsx` | Saved addresses CRUD | Yes | Yes |
| `/about` | `src/app/about/page.tsx` | About us page | No | Yes |
| `/contact` | `src/app/contact/page.tsx` | Contact form | No | Yes |
| `/login` | `src/app/login/page.tsx` | Clerk `<SignIn />` | No | Yes |
| `/register` | `src/app/register/page.tsx` | Clerk `<SignUp />` | No | Yes |
| `/profile` | `src/app/profile/page.tsx` | User profile / settings | Yes | Yes |
| `/admin` | `src/app/admin/page.tsx` | Admin dashboard (KPIs, charts) | Admin | Yes |
| `/admin/products` | `src/app/admin/products/page.tsx` | Admin products CRUD | Admin | Yes |
| `/admin/orders` | `src/app/admin/orders/page.tsx` | Admin orders management | Admin | Yes |
| `/admin/discounts` | `src/app/admin/discounts/page.tsx` | Admin discount codes CRUD | Admin | Yes |
| `/admin/analytics` | `src/app/admin/analytics/page.tsx` | Admin deep-dive analytics | Admin | Yes |
| `/admin/users` | `src/app/admin/users/page.tsx` | Admin customers view | Admin | Yes |

### API Routes (24 endpoints)

| Method | Route | Purpose | Auth |
|--------|-------|---------|:----:|
| GET | `/api/products?category=&search=&sort=` | List products with filters | No |
| GET | `/api/products/[id]` | Single product | No |
| GET | `/api/cart?session_id=` | Get cart items | No* |
| POST | `/api/cart` | Add item to cart | No* |
| DELETE | `/api/cart/[itemId]` | Remove from cart | No* |
| POST | `/api/checkout/create-order` | Create Razorpay order | Yes |
| POST | `/api/checkout/create-supabase-order` | Save order after payment | Yes |
| POST | `/api/checkout/verify-payment` | Verify Razorpay signature | Yes |
| GET | `/api/addresses` | List user's addresses | Yes |
| POST | `/api/addresses` | Add address | Yes |
| PUT | `/api/addresses/[id]` | Update address | Yes |
| DELETE | `/api/addresses/[id]` | Delete address | Yes |
| PATCH | `/api/addresses/[id]` | Set address as default | Yes |
| GET | `/api/orders` | User's orders | Yes |
| GET | `/api/orders/[id]` | Order detail | Yes |
| GET | `/api/orders/[id]/tracking` | Tracking events | Yes |
| POST | `/api/orders/[id]/cancel` | Cancel order | Yes |
| GET | `/api/reviews?product_id=` | Product reviews | No |
| POST | `/api/reviews` | Add review | Yes |
| GET | `/api/wishlist` | User's wishlist | Yes |
| POST | `/api/wishlist` | Add to wishlist | Yes |
| DELETE | `/api/wishlist/[productId]` | Remove from wishlist | Yes |
| GET | `/api/rewards` | User rewards balance + history | Yes |
| GET | `/api/admin/analytics` | Store-wide analytics | Admin |
| GET | `/api/admin/products` | All products | Admin |
| POST | `/api/admin/products` | Create product | Admin |
| PUT | `/api/admin/products` | Update product | Admin |
| DELETE | `/api/admin/products?id=` | Delete product | Admin |
| GET | `/api/admin/orders` | All orders | Admin |
| PATCH | `/api/admin/orders/[id]` | Update order status | Admin |
| GET | `/api/admin/discounts` | All discount codes | Admin |
| POST | `/api/admin/discounts` | Create discount | Admin |
| PUT | `/api/admin/discounts` | Update discount | Admin |
| DELETE | `/api/admin/discounts?id=` | Delete discount | Admin |
| GET | `/api/admin/users` | All users (derived from orders) | Admin |

*Cart uses `session_id` (UUID) for guest carts; Clerk `userId` for logged-in users.

---

## 4. Component Hierarchy

```
<RootLayout>                           src/app/layout.tsx
├── <ClerkProvider>                    Auth context
├── <GlobalCanvas>                     src/components/3d/GlobalCanvas.tsx
│   ├── <StarField />                  Star particles
│   ├── <PlaceholderChurroPlanet />    Rotating torus
│   └── <UFOFleet />                   Floating UFOs
├── <Header>                           src/components/layout/Header.tsx
│   ├── Logo (link to /)
│   ├── Search bar (navigates to /products?search=)
│   ├── <WishlistButton />             Heart icon → /dashboard
│   ├── <CartDrawer />                 Slide-out cart
│   └── <HeaderAuth> → <UserButton />  Clerk auth widget
├── <AppShell>                         src/components/layout/AppShell.tsx
│   └── {children} (page content)
│
├── Homepage:                          src/app/page.tsx
│   ├── Hero section (heading + CTA)
│   ├── Featured Products (fetch /api/products)
│   ├── Planets section (3D emoji cards)
│   ├── Floating Feature Cards
│   └── Newsletter section
│
├── Products Listing:                  src/app/products/page.tsx
│   ├── Category tabs
│   ├── Search bar
│   ├── Sort dropdown
│   └── Product grid (emoji + name + price + <AddToCartButton />)
│
├── Product Detail:                    src/app/products/[id]/page.tsx
│   ├── Product hero (emoji, name, price, stock)
│   ├── <AddToCartButton />
│   └── Reviews section
│
├── Cart:                              src/app/cart/page.tsx
│   ├── Cart items (quantity controls, remove)
│   ├── Subtotal
│   └── Checkout button
│
├── Checkout:                          src/app/checkout/page.tsx
│   ├── Step 1: Shipping address (<AutocompleteInput />)
│   ├── Step 2: Order summary + Razorpay payment
│   └── Step 3: Confirmation
│
├── Dashboard:                         src/app/dashboard/page.tsx
│   └── Order history list
│
├── Admin Layout:                      src/app/admin/layout.tsx
│   ├── Sidebar nav (Dashboard, Products, Orders, Users, Discounts, Analytics)
│   ├── Top bar (user email, avatar)
│   └── <AdminDashboard> / <AdminProducts> / etc.
│
└── Global:                           everywhere
    ├── <LoadingScreen />              src/components/layout/LoadingScreen.tsx
    ├── <AddToCartButton />            src/components/ui/AddToCartButton.tsx
    ├── <WishlistButton />             src/components/ui/WishlistButton.tsx
    └── <CartDrawer />                 src/components/ui/CartDrawer.tsx
```

### Key Component Patterns

- **All** page files are `"use client"` — no Server Components used anywhere
- **All** pages that accept `params` use `{ params }: { params: Promise<{ id: string }> }` with `await params` (Next.js 16 async params API)
- **Admin** pages distinguish regular users from admins via `user?.publicMetadata?.role === "admin"` or explicit email whitelist in `admin/layout.tsx`
- **3D** components render on a fixed `z-[-1]` canvas that wraps all routes; page content overlays on top

---

## 5. Data Flow

### Authentication Flow

```
[User] → <SignIn /> page (/login)
       → Clerk popup redirect 
       → Clerk cookies/session set
       → <HeaderAuth> reads useUser() → shows avatar
       → API routes read auth via `await auth()` from @clerk/nextjs/server
```

**Key auth patterns:**
- `src/app/login/page.tsx` uses `<SignIn routing="hash" />` (Clerk embedded component)
- `src/app/register/page.tsx` uses `<SignUp routing="hash" />`
- API routes use `const { userId } = await auth()` from `@clerk/nextjs/server` to identify users
- Admin pages check `user?.publicMetadata?.role === "admin"` OR hardcoded emails: `admin@churroverse.com`, `shravanphutanr@gmail.com`
- Guest users can browse products and add to cart (cart uses `session_id` UUID for guests)

### Cart Data Flow

```
[Product Page] → Click "Add to Cart"
  → src/components/ui/AddToCartButton.tsx (checks auth first)
    → If logged in: fetch POST /api/cart { product_id, quantity, userId }
    → If guest: generate session_id UUID, store in localStorage
    → useCartStore.addItem() (Zustand persist + Supabase sync)

[Cart State Management]
  useCartStore (src/store/useCartStore.ts):
    - Initializes from localStorage via Zustand persist
    - IsLoggedIn: fetches DB cart from /api/cart
    - IsGuest: reads session_id from localStorage, fetches /api/cart?session_id=
    - addItem(): calls API POST + updates local store
    - removeItem(): calls API DELETE + updates local store
    - clearCart(): clears items
    - Cart persists across sessions via Zustand middleware persist

[Cart Drawer]
  <CartDrawer> reads useCartStore → displays items, quantities, total
  "View Cart" → /cart (full page)
  "Checkout" → /checkout (auth-gated)
```

### Checkout & Payment Flow

```
[Checkout Page] → src/app/checkout/page.tsx
  1. User must be logged in (redirects to /login if not)
  2. Select/create shipping address (via <AutocompleteInput />)
  3. Apply discount code (via /api/admin/discounts)
  4. Click "Place Order" →
      POST /api/checkout/create-order
        → Creates Razorpay order via Razorpay API
        → Returns order_id (Razorpay) + amount
      → Razorpay Checkout opens (popup)
        → User completes payment
        → Razorpay calls back with razorpay_payment_id, razorpay_order_id, razorpay_signature
      POST /api/checkout/verify-payment
        → Computes HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, RAZORPAY_KEY_SECRET)
        → If valid: 
          POST /api/checkout/create-supabase-order
            → Inserts into `orders` table
            → Inserts into `order_items` table
            → Clears cart
            → Returns order confirmation
        → If invalid: error response
```

### Admin Data Flow

```
[Admin Dashboard] → src/app/admin/page.tsx
  Fetches: GET /api/admin/analytics
  → Calls getAnalytics() from src/lib/admin.ts
    → Queries Supabase: total orders, total revenue, avg order value, unique users
    → Queries revenue grouped by day (14 days)
    → Queries orders grouped by status
    → Queries top products by total_sold
  → Renders KPI cards, revenue bar chart, status bars, top products list

[Admin Products CRUD] → src/app/admin/products/page.tsx
  Fetch: GET /api/admin/products → getAllProducts()
  Create: POST /api/admin/products → body → createProduct()
  Update: PUT /api/admin/products → body { id, ... } → updateProduct()
  Delete: DELETE /api/admin/products?id= → deleteProduct()
```

### Wishlist Data Flow

```
[Product Detail] → <WishlistButton /> → src/components/ui/WishlistButton.tsx
  → useWishlistStore (Zustand persist)
  → Toggles: POST /api/wishlist or DELETE /api/wishlist/[productId]
  → Updates local store
  → Heart icon fills/unfills
```

### Review Data Flow

```
[Product Detail Page] → Reviews section
  → Fetch: GET /api/reviews?product_id={id}
    → Returns list of reviews with user_id (Clerk ID), rating, comment, created_at
  → Add: POST /api/reviews { product_id, rating, comment }
    → Requires auth (userId from Clerk)
    → Inserts into reviews table
    → Re-fetches reviews list
```

---

## 6. API Routes — Full Specification

### Products

**`GET /api/products?category=churro&search=galactic&sort=price-asc`**
- Query params: `category` (default "all"), `search` (optional, ilike name), `sort` (featured|price-asc|price-desc|rating)
- Returns: `{ products: Product[] }`

**`GET /api/products/[id]`**
- Returns: `{ product: Product }` or 404

### Cart

**`GET /api/cart?session_id=xxx&user_id=yyy`**
- Either `session_id` (guest) or `user_id` (logged in) must be provided
- Returns: `{ items: CartItem[] }` — includes product details via Supabase join

**`POST /api/cart`**
- Body: `{ product_id, quantity, session_id?, user_id? }`
- Upserts cart_items (same product_id → quantity increment)
- Returns: `{ item: CartItem }`

**`DELETE /api/cart/[itemId]?session_id=xxx&user_id=yyy`**
- Deletes cart item
- Returns: `{ success: true }`

### Checkout

**`POST /api/checkout/create-order`**
- Body: `{ amount, currency: "INR", receipt, user_id }`
- Creates Razorpay order via `razorpay.orders.create()`
- Returns: `{ order: RazorpayOrder }` (raw Razorpay response)

**`POST /api/checkout/verify-payment`**
- Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
- Verifies with HMAC-SHA256 using `RAZORPAY_KEY_SECRET`
- Returns: `{ verified: true/false }`

**`POST /api/checkout/create-supabase-order`**
- Body: `{ user_id, items, total, shipping_address, discount_code?, razorpay_payment_id, razorpay_order_id }`
- Creates `orders` record + `order_items` records (transaction)
- Clears cart items
- Updates reward points
- Returns: `{ order: Order }`

### Addresses

**`GET /api/addresses`**
- Returns: `{ addresses: Address[] }` (user's addresses via userId, sorted by is_default desc)

**`POST /api/addresses`**
- Body: Address fields + userId
- Returns: `{ address: Address }`

**`PUT /api/addresses/[id]`**
- Body: partial Address fields
- Returns: `{ address: Address }`

**`DELETE /api/addresses/[id]`**
- Returns: `{ success: true }`

**`PATCH /api/addresses/[id]`** (set default)
- Body: `{ is_default: true }`
- Unsets all other defaults for user, sets this one
- Returns: `{ address: Address }`

### Orders

**`GET /api/orders`**
- Returns: `{ orders: Order[] }` (user's orders, ordered by created_at desc)

**`GET /api/orders/[id]`**
- Includes `items` (from order_items) with product details
- Returns: `{ order: Order & { items: OrderItem[] } }`

**`GET /api/orders/[id]/tracking`**
- Returns: `{ events: TrackingEvent[] }`

**`POST /api/orders/[id]/cancel`**
- Updates status to "cancelled" if status is "pending" or "paid"
- Returns: `{ order: Order }`

### Reviews

**`GET /api/reviews?product_id=xxx`**
- Returns: `{ reviews: Review[] }` (with user email from Clerk)

**`POST /api/reviews`**
- Body: `{ product_id, rating, comment }`
- Returns: `{ review: Review }`

### Wishlist

**`GET /api/wishlist`**
- Returns: `{ items: WishlistItem[] }` (includes product details)

**`POST /api/wishlist`**
- Body: `{ product_id }`
- Returns: `{ item: WishlistItem }`

**`DELETE /api/wishlist/[productId]`**
- Returns: `{ success: true }`

### Rewards

**`GET /api/rewards`**
- Returns: `{ points: number, tier: string, history: RewardTransaction[] }`

### Admin Endpoints

**`GET /api/admin/analytics`**
- Returns: `{ analytics: Analytics }` where Analytics includes:
  - totalRevenue, totalOrders, averageOrderValue, totalProducts, totalUsers
  - revenueByDay: `{ date, revenue }[]` (14 days)
  - ordersByStatus: `{ status, count }[]`
  - topProducts: `Product[]` sorted by total_sold

**`GET /api/admin/products`**
- Returns: `{ products: Product[] }`

**`POST /api/admin/products`** — body: Product fields — Returns: `{ product }`
**`PUT /api/admin/products`** — body: `{ id, ...fields }` — Returns: `{ product }`
**`DELETE /api/admin/products?id=`** — Returns: `{ success: true }`

**`GET /api/admin/orders`**
- Returns: `{ orders: Order[] }`

**`PATCH /api/admin/orders/[id]`**
- Body: `{ status, note? }` — also calls addTrackingEvent()
- Returns: `{ success: true }`

**`GET /api/admin/discounts`**
- Returns: `{ discounts: DiscountCode[] }`

**`POST /api/admin/discounts`** — creates discount
**`PUT /api/admin/discounts`** — updates discount
**`DELETE /api/admin/discounts?id=`** — deletes discount

**`GET /api/admin/users`**
- Derives user list from unique user_ids in orders table
- Returns: `{ users: { id, orderCount, totalSpent, lastOrder }[] }`

---

## 7. Database Schema (Inferred from Code)

Supabase PostgreSQL tables referenced in the codebase. **No migration files exist — schema is managed via Supabase UI/CLI only.**

### `products`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `name` | text | NOT NULL |
| `slug` | text | Unique, used for URL |
| `description` | text | Short description |
| `long_desc` | text | Nullable, full description |
| `price` | integer | Price in **paise** (₹ × 100) |
| `category` | text | Values: churro, shake, iced-tea, waffle, munchies |
| `emoji` | text | Single emoji char for visual display |
| `stock` | integer | Inventory count |
| `tag` | text | Nullable, e.g. "Premium", "Bestseller" |
| `featured` | boolean | Whether shown on homepage |
| `rating` | float | Nullable, computed from reviews |
| `total_sold` | integer | Nullable, aggregate of order_items |
| `images` | jsonb | Nullable, currently unused |
| `created_at` | timestamptz | default `now()` |

### `cart_items`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `user_id` | text | Nullable, Clerk user ID |
| `session_id` | text | Nullable, UUID for guest carts |
| `product_id` | UUID | FK → products.id |
| `quantity` | integer | |
| `created_at` | timestamptz | |

### `wishlists`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `user_id` | text | Clerk user ID |
| `product_id` | UUID | FK → products.id |
| `created_at` | timestamptz | |

### `orders`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `order_number` | text | Human-readable, e.g. "CHR-XXXX" |
| `user_id` | text | Clerk user ID |
| `status` | text | pending, paid, processing, shipped, delivered, cancelled |
| `total` | integer | Total in paise |
| `shipping_address` | jsonb | Address snapshot |
| `discount_code` | text | Nullable |
| `discount_amount` | integer | Nullable, discount in paise |
| `razorpay_order_id` | text | Razorpay reference |
| `razorpay_payment_id` | text | Nullable until paid |
| `notes` | text | Nullable |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### `order_items`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `order_id` | UUID | FK → orders.id |
| `product_id` | UUID | FK → products.id |
| `product_name` | text | Snapshot at time of order |
| `product_emoji` | text | Snapshot |
| `quantity` | integer | |
| `unit_price` | integer | Price in paise |
| `subtotal` | integer | quantity × unit_price |

### `addresses`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `user_id` | text | Clerk user ID |
| `full_name` | text | |
| `phone` | text | |
| `street` | text | |
| `city` | text | |
| `state` | text | |
| `pincode` | text | |
| `is_default` | boolean | Only one default per user |

### `reviews`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `product_id` | UUID | FK → products.id |
| `user_id` | text | Clerk user ID |
| `rating` | integer | 1-5 |
| `comment` | text | |
| `created_at` | timestamptz | |

### `rewards`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `user_id` | text | Unique, Clerk user ID |
| `points` | integer | Current balance |
| `tier` | text | bronze, silver, gold, platinum |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### `reward_transactions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `user_id` | text | Clerk user ID |
| `points` | integer | Positive (earn) or negative (redeem) |
| `type` | text | earned, redeemed, expired |
| `description` | text | |
| `created_at` | timestamptz | |

### `tracking_events`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `order_id` | UUID | FK → orders.id |
| `status` | text | Same enum as orders.status |
| `note` | text | |
| `created_at` | timestamptz | |

### `discount_codes`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `code` | text | Unique, uppercase |
| `type` | text | "percentage" or "fixed" |
| `value` | integer | Percent (1-100) or paise amount |
| `min_cart_value` | integer | Minimum cart total in paise |
| `max_uses` | integer | Nullable, null = unlimited |
| `used_count` | integer | Counter, default 0 |
| `is_active` | boolean | |
| `expires_at` | timestamptz | Nullable |
| `description` | text | Nullable |
| `created_at` | timestamptz | |

---

## 8. Key Features (with file pointers)

### 8.1 Space-Themed 3D Background
- **Files:** `src/components/3d/GlobalCanvas.tsx`, `StarField.tsx`, `PlaceholderChurroPlanet.tsx`, `UFOFleet.tsx`
- Renders on a fixed `<div id="canvas-container" className="fixed inset-0 z-[-1]">` in root layout
- Uses React Three Fiber with Drei helpers; transpiled via next.config to avoid ESM issues
- Features: animated star particles field, rotating torus "planet", floating UFO group

### 8.2 Product Catalog
- **Files:** `src/app/products/page.tsx`, `products/[id]/page.tsx`, `src/lib/products.ts`
- Listing with category tabs, search (ilike on name), sort (featured, price asc/desc, rating)
- Detail page with product info, add-to-cart, reviews section
- Products displayed with emoji icons instead of images (currently no image upload)

### 8.3 Shopping Cart (Guest + Auth)
- **Files:** `src/store/useCartStore.ts`, `src/components/ui/CartDrawer.tsx`, `src/components/ui/AddToCartButton.tsx`, `src/app/cart/page.tsx`, `src/lib/cart.ts`, `src/app/api/cart/`
- Zustand store with `persist` middleware (localStorage) for offline resilience
- Guest users: cart tracked via `session_id` UUID stored in localStorage
- Logged-in users: cart synced to DB via Clerk `userId`
- Cart drawer slides in from right, shows items, quantities, total, checkout CTA

### 8.4 Checkout & Razorpay Payments
- **Files:** `src/app/checkout/page.tsx`, `src/app/api/checkout/`
- Multi-step: address selection/creation → Razorpay popup → order confirmation
- Integration: Razorpay Node SDK (`razorpay.orders.create()`), HMAC-SHA256 signature verification
- Order creation: two-phase — create Razorpay order first, then save to Supabase on success
- Prices stored in paise throughout; `formatPrice()` utility for display

### 8.5 User Dashboard
- **Files:** `src/app/dashboard/page.tsx`, `dashboard/orders/[id]/page.tsx`, `dashboard/tracking/page.tsx`, `dashboard/addresses/page.tsx`
- Order history with detail view and status timeline
- Order tracking by order number or ID
- Address management (CRUD + set default)

### 8.6 Wishlist
- **Files:** `src/store/useWishlistStore.ts`, `src/components/ui/WishlistButton.tsx`, `src/app/api/wishlist/`
- Zustand persist store + DB sync for logged-in users
- Heart toggle button on product cards/details

### 8.7 Product Reviews
- **Files:** `src/lib/reviews.ts`, `src/app/api/reviews/`
- Star rating (1-5) + text comment
- Requires authentication to post; anyone can read

### 8.8 Rewards Program
- **Files:** `src/lib/rewards.ts`, `src/app/api/rewards/`
- Points earned per order (tiers: bronze, silver, gold, platinum)
- Balance + transaction history via API

### 8.9 Order Tracking
- **Files:** `src/lib/tracking.ts`, `src/app/api/orders/[id]/tracking/`
- Timeline of status changes per order
- Triggered when admin updates order status

### 8.10 Admin Panel
- **Files:** `src/app/admin/layout.tsx`, `admin/page.tsx`, `admin/products/page.tsx`, `admin/orders/page.tsx`, `admin/discounts/page.tsx`, `admin/analytics/page.tsx`, `admin/users/page.tsx`, `src/lib/admin.ts`
- Full CRUD for products and discounts
- Order management with inline status change dropdown
- Analytics dashboard with revenue chart, order status breakdown, top products
- Customer view (derived from orders data)

### 8.11 Address Autocomplete
- **Files:** `src/components/ui/AutocompleteInput.tsx`, `src/lib/india-places.ts`
- Static Indian cities/states dataset in `india-places.ts`
- Autocomplete dropdown on address fields (street, city, state, pincode)

---

## 9. Design System

### Theme (from `src/app/globals.css`)

```css
@import "tailwindcss";
@import "tw-animate-css";

/* Tailwind v4 theme variables */
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-background: #020010;
  --color-foreground: #fafafa;
  --color-card: #0a0a12;
  --color-card-foreground: #fafafa;
  --color-popover: #0a0a12;
  --color-popover-foreground: #fafafa;
  --color-primary: #ea580c;           /* orange-600 */
  --color-primary-foreground: #fafafa;
  --color-secondary: #0a0a12;
  --color-secondary-foreground: #fafafa;
  --color-muted: #1a1a2e;
  --color-muted-foreground: #a1a1aa;
  --color-accent: rgba(234,88,12,0.15);
  --color-accent-foreground: #fafafa;
  --color-destructive: #dc2626;
  --color-destructive-foreground: #fafafa;
  --color-border: rgba(255,255,255,0.05);
  --color-input: rgba(255,255,255,0.05);
  --color-ring: #ea580c;
  --radius: 0.75rem;                 /* 12px default */
}

/* Dark color-scheme + global base styles */
body { background: #020010; color: #fafafa; }
* { scrollbar-width: thin; scrollbar-color: #ea580c20 transparent; }
```

### Visual Style Patterns
- **Background:** Deep space `#020010` with `#0a0a12` card surfaces
- **Borders:** Subtle `border-white/5` on cards/tables
- **Accent color:** Orange (`#ea580c`) throughout — buttons, highlights, active states
- **Glow effects:** `shadow-[0_0_15px_rgba(234,88,12,0.2)]` on primary buttons
- **Gradient buttons:** `bg-gradient-to-r from-orange-600 to-red-600`
- **Typography:** Geist Sans (default), Geist Mono for prices/codes/data
- **Tabular numbers:** `tabular-nums` class on all monetary values
- **Spinner:** Rocket icon with rotating border (repeated across all loading states)
- **Muted text:** `text-gray-500`, `text-gray-600`
- **Table style:** Dark `#0a0a12` background, `border-white/5` rows, hover states on rows
- **Modal style:** Fixed overlay with `bg-black/60 backdrop-blur-sm` + centered white-border card
- **Modal header:** Gradient line `from-transparent via-orange-500/50 to-transparent`

### Animation Patterns
- All animations via **Framer Motion** (`motion.div`, `motion.button`, etc.)
- **Loading states:** `animate-spin` + `animate-pulse` on Rocket icon
- **Page entrance:** `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`
- **Table rows:** `initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}` with staggered delay
- **Buttons:** `whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}`
- **Staggered children:** `container` variant with `staggerChildren: 0.08`
- **Modal entrance:** Spring animation `type: "spring", stiffness: 200, damping: 20`
- **Status dots:** `animate-pulse` on "processing" status

### shadcn/ui Configuration (`components.json`)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "utils": "@/lib/utils",
    "components": "@/components"
  }
}
```

### Loading Screen Pattern (used across all admin pages)

Every admin page repeats this exact pattern:
```tsx
<div className="flex items-center justify-center h-80">
  <div className="flex flex-col items-center gap-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
      <SomeIcon className="absolute inset-0 m-auto w-5 h-5 text-orange-400 animate-pulse" />
    </div>
    <p className="text-gray-600 text-sm font-mono">Loading message...</p>
  </div>
</div>
```

---

## 10. Every File in `src/app/` Described

### Pages (20 files)

| File | Lines | Description |
|------|-------|-------------|
| `src/app/layout.tsx` | ~70 | Root layout: ClerkProvider, GlobalCanvas, Header, AppShell, inter/font classes |
| `src/app/globals.css` | ~90 | Tailwind v4 theme, shadcn tokens, base styles, scrollbar |
| `src/app/page.tsx` | ~260 | Homepage: hero, featured products fetch, planets cards, floating cards, newsletter |
| `src/app/products/page.tsx` | ~260 | Product grid: category tabs, search, sort dropdown, cards with AddToCartButton |
| `src/app/products/[id]/page.tsx` | ~220 | Product detail: hero, price, stock, AddToCartButton, reviews list + form |
| `src/app/cart/page.tsx` | ~200 | Full cart page: items list, quantity controls, remove, subtotal, checkout button |
| `src/app/checkout/page.tsx` | ~350 | Multi-step checkout: address form (AutocompleteInput) → Razorpay → confirmation |
| `src/app/dashboard/page.tsx` | ~180 | Dashboard: orders list with status badges, links to detail |
| `src/app/dashboard/orders/[id]/page.tsx` | ~180 | Order detail: items table, shipping address, status timeline, cancel button |
| `src/app/dashboard/tracking/page.tsx` | ~120 | Tracking: search by order number, display tracking events |
| `src/app/dashboard/addresses/page.tsx` | ~200 | Addresses: card list + add/edit modal form with AutocompleteInput |
| `src/app/about/page.tsx` | ~100 | About page: story/mission content |
| `src/app/contact/page.tsx` | ~100 | Contact form: name, email, message |
| `src/app/login/page.tsx` | ~30 | Clerk `<SignIn routing="hash" />` wrapper |
| `src/app/register/page.tsx` | ~30 | Clerk `<SignUp routing="hash" />` wrapper |
| `src/app/profile/page.tsx` | ~60 | User profile: Clerk `<UserProfile />` wrapper |
| `src/app/admin/layout.tsx` | ~200 | Admin sidebar: nav, auth gate (role check + email whitelist), responsive hamburger |
| `src/app/admin/page.tsx` | ~244 | Admin dashboard: 4 KPI cards, revenue chart, status bars, top products |
| `src/app/admin/products/page.tsx` | ~450 | Admin products CRUD: table + modal form (name, slug, price, stock, emoji, category, etc.) |
| `src/app/admin/orders/page.tsx` | ~218 | Admin orders: table with filter/search, inline status change dropdown |
| `src/app/admin/discounts/page.tsx` | ~413 | Admin discounts CRUD: table + modal (code, type, value, min_cart, max_uses, expiry) |
| `src/app/admin/analytics/page.tsx` | ~240 | Admin analytics: 4 KPI cards, revenue chart, status chart, top products, summary |
| `src/app/admin/users/page.tsx` | ~175 | Admin users: table with search, summary stats row |

**Loading files:** `src/app/admin/loading.tsx`, `admin/products/loading.tsx`, `admin/orders/loading.tsx`, `admin/discounts/loading.tsx`, `admin/analytics/loading.tsx`, `admin/users/loading.tsx` — each wraps the Rocket spinner pattern.

### API Route Handlers (23 files)

| File | Methods | Description |
|------|---------|-------------|
| `api/products/route.ts` | GET | List products with category/search/sort |
| `api/products/[id]/route.ts` | GET | Single product by ID |
| `api/cart/route.ts` | GET, POST | Get cart (by session_id or user_id), add item |
| `api/cart/[itemId]/route.ts` | DELETE | Remove cart item |
| `api/checkout/create-order/route.ts` | POST | Create Razorpay order |
| `api/checkout/create-supabase-order/route.ts` | POST | Save order to Supabase |
| `api/checkout/verify-payment/route.ts` | POST | Verify Razorpay signature |
| `api/addresses/route.ts` | GET, POST | List/add addresses |
| `api/addresses/[id]/route.ts` | PUT, DELETE, PATCH | Update/delete/set-default address |
| `api/orders/route.ts` | GET | User's orders |
| `api/orders/[id]/route.ts` | GET | Order detail (includes items) |
| `api/orders/[id]/tracking/route.ts` | GET | Tracking events for order |
| `api/orders/[id]/cancel/route.ts` | POST | Cancel order (if pending/paid) |
| `api/reviews/route.ts` | GET, POST | List/add reviews |
| `api/wishlist/route.ts` | GET, POST | List/add wishlist items |
| `api/wishlist/[productId]/route.ts` | DELETE | Remove from wishlist |
| `api/rewards/route.ts` | GET | Rewards balance + history |
| `api/admin/analytics/route.ts` | GET | Store analytics (revenue, orders, top products) |
| `api/admin/products/route.ts` | GET, POST, PUT, DELETE | Admin products CRUD |
| `api/admin/orders/route.ts` | GET | All orders |
| `api/admin/orders/[id]/route.ts` | PATCH | Update order status (also adds tracking event) |
| `api/admin/discounts/route.ts` | GET, POST, PUT, DELETE | Admin discounts CRUD |
| `api/admin/users/route.ts` | GET | Derive users from orders |

---

## Architecture Summary

**Pattern:** All-client, database-backed SPA disguised as a Next.js App Router app.

- **Every page** uses `"use client"` — zero Server Components
- **State:** Zustand (persisted) for cart + wishlist; React `useState`/`useEffect` for everything else
- **Data:** Direct Supabase queries from lib modules; no ORM beyond Supabase JS client
- **Auth:** Clerk handles sessions; API routes use `auth()` from `@clerk/nextjs/server`
- **Payments:** Razorpay popup integration with server-side verification
- **3D:** React Three Fiber scene on a fixed background canvas
- **Styling:** Tailwind v4 with shadcn/ui base-nova style, orange/dark theme
- **Admin:** Full CRUD panel with its own layout, auth gating, and analytics
- **No tests** exist in the codebase
- **No database migration files** — schema managed externally in Supabase

---

*Generated 2026-06-20 from full codebase traversal — 20 pages, 23 API routes, 14 components, 13 lib modules, 2 stores, 0 tests.*
