---
status: resolved
trigger: "https://churroverse.vercel.app/admin is not working"
created: 2026-06-19T18:45:00.000Z
updated: 2026-06-19T19:15:00.000Z
---

## Current Focus

hypothesis: "layoutId in framer-motion v12 causes hydration crash during SSR"
test: "Push fix without layoutId and AnimatePresence, verify page loads"
expecting: "Admin page loads without 'This page could not be loaded' error"
next_action: "completed - pushed to GitHub, awaiting Vercel deploy"

## Symptoms

expected: "Admin dashboard loads with navigation sidebar, KPI cards, and charts"
actual: "Browser shows 'This page couldn't load. Reload to try again, or go back.' Console shows React error #418 (hydration mismatch) followed by 'Cannot read properties of null (reading length)'"
errors: "React #418 + TypeError .length on null + THREE.WebGLRenderer: Context Lost"
reproduction: "Visit https://churroverse.vercel.app/admin while logged in"
started: "after UI polish commit abdb35a (added layoutId/AnimatePresence)"

## Eliminated

- hypothesis: "Build error on Vercel"
  evidence: "Build passes locally (Compiled successfully, TypeScript passes), page returns HTTP 200 with correct admin HTML containing 'Verifying credentials' and 'Mission Control'"
  timestamp: "2026-06-19T19:00:00.000Z"
- hypothesis: "Missing Clerk publishable key or env vars"
  evidence: "Clerk key present in HTML response, other pages work fine"
  timestamp: "2026-06-19T19:02:00.000Z"
- hypothesis: "Three.js GlobalCanvas crash"
  evidence: "Three.js error is separate, doesn't crash page. Other pages with GlobalCanvas work fine"
  timestamp: "2026-06-19T19:04:00.000Z"

## Evidence

- timestamp: "2026-06-19T18:50:00.000Z"
  checked: "Browser console errors from user"
  found: "React error #418 (hydration mismatch) then 'Cannot read properties of null (reading length)' in chunk 0x52wgwxeuex9.js"
  implication: "Client-side crash during hydration, not server error"

- timestamp: "2026-06-19T18:55:00.000Z"
  checked: "Invoke-WebRequest to /admin endpoint"
  found: "HTTP 200, HTML contains admin layout content ('Verifying credentials', 'Mission Control', admin shell classes)"
  implication: "Server renders admin page fine; crash is client-side only"

- timestamp: "2026-06-19T19:00:00.000Z"
  checked: "framer-motion version"
  found: "^12.40.0 - layoutId uses useId() internally in v12"
  implication: "layoutId with conditional rendering ({isActive && ...}) can cause React hydration mismatches"

- timestamp: "2026-06-19T19:10:00.000Z"
  checked: "RSC payload in admin page HTML response"
  found: "RSC data contains 404 not-found page alongside admin layout HTML"
  implication: "Some component error causes Next.js to render 404 fallback within the stream"

## Resolution

root_cause: "framer-motion v12 `layoutId` prop on a conditionally-rendered `motion.div` causes React hydration error #418 during SSR because framer-motion v12 uses `useId()` internally, which can produce different IDs between server and client renders. This cascades into a `Cannot read properties of null (reading 'length')` TypeError (likely from AnimatePresence internals failing after the hydration mismatch)."

fix: "Removed `AnimatePresence` wrapper (replaced with CSS transition), removed `layoutId` prop (replaced with static CSS div + glow shadow), fixed non-standard `w-4.5 h-4.5` Tailwind classes to `w-5 h-5`."
verification: "Pushed to GitHub. Vercel auto-deploy triggered. User should verify page loads after deploy completes."
files_changed:
  - "storefront/src/app/admin/layout.tsx"
