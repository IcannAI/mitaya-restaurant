# Architecture — Mitaya's Restaurant Showcase

This document describes the system architecture, module boundaries, data flow,
and known technical debt of the `mitaya-restaurant` project.

Last updated: 2026-03 · Phase 4 complete

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Directory Structure](#2-directory-structure)
3. [Module Dependency Graph](#3-module-dependency-graph)
4. [State Management](#4-state-management)
5. [Routing](#5-routing)
6. [Data Flow](#6-data-flow)
7. [Service Layer](#7-service-layer)
8. [Storage Safety](#8-storage-safety)
9. [i18n](#9-i18n)
10. [Testing Strategy](#10-testing-strategy)
11. [Feature-Sliced Design Migration](#11-feature-sliced-design-migration)
12. [Backend Layer (Phase 4)](#12-backend-layer-phase-4)
13. [Known Technical Debt](#13-known-technical-debt)
14. [Architecture Decision Records](#14-architecture-decision-records)

---

## 1. System Overview

Mitaya's Restaurant is a **client-side SPA** built with React 19 + Vite.
All state is managed client-side; no backend is required to run the app.
Phase 4 introduces a Next.js API layer that coexists with Vite during migration.

```
Browser
  └── index.html
        └── index.tsx  (React entry)
              └── App.tsx  (router + context + layout)
                    ├── AppContext  (transitional God Object → Zustand)
                    ├── useCustomRouter  (hash-based navigation)
                    └── Pages
                          ├── HomePage
                          ├── MenuPage
                          └── ReservationPage
```

### Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | React | 19 | Concurrent features: useTransition, useOptimistic, lazy |
| Language | TypeScript | 5.8 | Strict mode; Zod as runtime type guard |
| Build | Vite | 6.4 | HMR, ESM, PostCSS |
| State | Zustand | latest | Phase 2 migration from AppContext |
| Styling | Tailwind CSS | 4 | PostCSS via `@import "tailwindcss"` |
| Animation | framer-motion | 12 | Declarative, cart + tab transitions |
| Forms | react-hook-form + zod | 7 + 4 | Schema-driven, no generics on useForm |
| i18n | react-i18next | latest | Phase 2; AppContext custom i18n being deprecated |
| Testing | Vitest + jsdom | latest | Smoke + schema + component tests |
| Backend | Next.js App Router | latest | Phase 4; coexists with Vite |

---

## 2. Directory Structure

```
mitaya-restaurant/
│
├── App.tsx                    # Router switch + context provider
├── index.tsx                  # React root render
├── index.css                  # Tailwind 4 entry (@import "tailwindcss")
├── types.ts                   # All TypeScript types + Zod schemas
├── constants.ts               # Static menu data + translation keys
│
├── components/
│   ├── Layout.tsx             # Nav + CartDrawer + main slot
│   ├── CartDrawer.tsx         # Slide-out cart UI
│   └── ui/
│       ├── Button.tsx         # shadcn/ui-inspired base component
│       └── Input.tsx          # shadcn/ui-inspired base component
│
├── context/
│   └── AppContext.tsx         # God Object — being migrated to store/
│                              # Currently manages: cart + language + UI toggles
│
├── store/                     # Zustand stores (Phase 2)
│   ├── cart.store.ts          # Cart: items, total, itemCount, safeStorage
│   ├── language.store.ts      # Language: zh-TW / en, isolated from cart
│   └── index.ts               # Barrel: export { useCartStore, useLanguageStore }
│
├── hooks/
│   ├── useCustomRouter.ts     # hash-based router — window.location.hash
│   ├── useMenuFilter.ts       # useTransition filter — non-blocking UI (Phase 3)
│   ├── useOptimisticCart.ts   # useOptimistic — instant cart feedback (Phase 3)
│   └── usePageLoader.ts       # lazy() + Suspense — route code splitting (Phase 3)
│
├── lib/
│   ├── safeStorage.ts         # Zod-guarded localStorage (Phase 0)
│   └── i18n.ts                # react-i18next init (Phase 2)
│
├── locales/                   # i18n locale files (Phase 2)
│   ├── en.json
│   └── zh-TW.json
│
├── services/                  # API service layer (Phase 1)
│   ├── reservation.ts         # submitReservation() → POST /api/reservation
│   └── menu.ts                # getMenuItems() → GET /api/menu (+ static fallback)
│
├── pages/
│   ├── HomePage.tsx
│   ├── MenuPage.tsx
│   └── ReservationPage.tsx
│
├── tests/
│   ├── setup.ts               # @testing-library/jest-dom
│   ├── smoke.test.ts          # Pure function + Zod schema (17 tests)
│   └── components/
│       ├── CartDrawer.test.tsx       # Zustand store integration (4 tests)
│       └── useCustomRouter.test.ts   # Hash navigation (3 tests)
│
├── src/                       # FSD migration target (Phase 3 scaffold)
│   ├── features/
│   │   └── cart/
│   │       ├── index.ts       # Public API — only import from here
│   │       ├── model/         # cart.store.ts + types.ts (re-exports)
│   │       └── ui/            # CartSummary (stub — migration pending)
│   ├── entities/
│   │   ├── menu-item/index.ts
│   │   └── reservation/index.ts
│   └── shared/
│       ├── lib/index.ts       # safeStorage re-export
│       └── config/index.ts    # APP_NAME, STORAGE_KEYS
│
├── docs/
│   └── adr/                   # Architecture Decision Records (Phase 0)
│       ├── 0001-custom-hash-router.md
│       ├── 0002-app-context-god-object.md
│       └── 0003-manual-shadcn-components.md
│
├── app/                       # Next.js App Router (Phase 4)
│   └── api/
│       ├── menu/route.ts      # GET  /api/menu
│       ├── reservation/route.ts  # POST /api/reservation
│       └── cart/route.ts      # GET/POST /api/cart (Phase 4b stub)
│
├── public/
│   └── manifest.json          # PWA manifest (Phase 4)
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml             # lint + build + test + security audit
│   │   ├── coverage.yml       # 40% line coverage threshold
│   │   └── lighthouse.yml     # a11y >= 0.98 enforced
│   ├── CODEOWNERS             # Architecture-sensitive file ownership
│   └── PULL_REQUEST_TEMPLATE.md
│
├── scripts/
│   ├── audit/                 # Read-only analysis scripts
│   └── roadmap/               # Phase execution scripts (phase0–4.sh)
│
├── vitest.config.ts
├── tsconfig.json
├── tsconfig.vitest.json       # Isolated test type resolution
├── tailwind.config.js
├── postcss.config.js
├── next.config.ts             # Phase 4 (coexists with Vite)
└── lighthouserc.json          # Phase 4 CI thresholds
```

---

## 3. Module Dependency Graph

```
index.tsx
    │
    └── App.tsx
          │
          ├── context/AppContext.tsx  ──────────────── [TRANSITIONAL]
          │       └── reads: constants.ts, types.ts    ↓ being replaced by store/
          │
          ├── store/                  ──────────────── [Phase 2 — Active]
          │   ├── cart.store.ts
          │   │       └── lib/safeStorage.ts
          │   │       └── types.ts (CartItemsSchema, CartItem)
          │   └── language.store.ts
          │           └── types.ts (Language)
          │
          ├── hooks/useCustomRouter.ts
          │
          ├── components/Layout.tsx
          │       └── components/CartDrawer.tsx
          │       └── components/ui/Button.tsx
          │       └── components/ui/Input.tsx
          │
          ├── pages/HomePage.tsx
          │       └── constants.ts (MENU_ITEMS)
          │
          ├── pages/MenuPage.tsx
          │       └── hooks/useMenuFilter.ts  [Phase 3]
          │       └── hooks/useOptimisticCart.ts  [Phase 3]
          │       └── constants.ts (MENU_ITEMS)
          │
          └── pages/ReservationPage.tsx
                  └── services/reservation.ts  [Phase 1]
                  └── types.ts (reservationSchema, ReservationFormData)
```

**Import rules (enforced in code review):**
- `pages/` may import from `components/`, `hooks/`, `store/`, `services/`, `types.ts`, `constants.ts`
- `components/` may import from `store/`, `types.ts`, `lib/`
- `services/` may import from `types.ts` only — no React imports
- `store/` may import from `lib/`, `types.ts` only — no React imports
- `lib/` may not import from any project module

---

## 4. State Management

### Current State (Transitional)

The project is mid-migration from a single `AppContext` God Object to domain-specific Zustand stores.

```
Phase 1 (AppContext — God Object)       Phase 2+ (Zustand — Active)
─────────────────────────────────       ──────────────────────────────
AppContext manages:                     store/cart.store.ts manages:
  - cart items + total                    - items: CartItem[]
  - language (zh-TW / en)                - total: number
  - CartDrawer open/close                 - itemCount: number
                                          - addItem / removeItem / updateQty
                                          - safeStorage persistence

                                        store/language.store.ts manages:
                                          - language: Language
                                          - setLanguage / toggle
                                          - localStorage persistence
```

### Zustand Store Design

```typescript
// Fine-grained selector — only re-renders when items change
const items = useCartStore(s => s.items)

// Multiple values — useShallow prevents reference-change re-renders
const { items, addItem } = useCartStore(
  useShallow(s => ({ items: s.items, addItem: s.addItem }))
)
```

**Why `total` and `itemCount` are stored as state, not getters:**
Zustand's `create()` function does not support JavaScript getter syntax.
Values are computed and stored synchronously on every mutation, ensuring
consumers always read the latest derived value without selector complexity.

### Migration Status

```
AppContext.tsx     ← still used by components not yet migrated
store/            ← new components should use this directly
```

Components must be migrated one PR at a time. Do not add new `useApp()` calls.

---

## 5. Routing

### Custom Hash Router

`hooks/useCustomRouter.ts` implements hash-based SPA navigation using
`window.location.hash` and the `hashchange` DOM event.

```
URL: https://mitaya-restaurant.vercel.app/#/menu
                                            ↑
                                    hash path segment

Route map:
  #/           → HomePage
  #/menu       → MenuPage
  #/reservation → ReservationPage
```

**Why not react-router-dom?**
See [ADR-0001](./docs/adr/0001-custom-hash-router.md).
Short answer: demonstrates browser routing mechanics; lightweight for 3-page MVP.

**Limitations:**
- No nested routes
- No URL params (e.g. `/menu/:id`)
- Incompatible with SSR — full rewrite required for Next.js migration
- `react-router-dom` is currently installed but unused (pending removal)

**Migration trigger:** Adding a detail page (e.g. `/menu/:id`) or migrating to Next.js.

---

## 6. Data Flow

### Cart Add Flow

```
User clicks "Add to Cart"
    │
    ├── [useOptimisticCart] → addOptimistic(item)
    │       └── Immediate UI update via useOptimistic (React 19)
    │
    └── useCartStore.addItem(item)
            ├── Compute updated items array
            ├── Compute total + itemCount synchronously
            ├── safeWrite('mitaya-cart', updated)  → localStorage
            └── set({ items, total, itemCount })   → Zustand state
                    └── Only components subscribing to changed slices re-render
```

### Reservation Submit Flow

```
User submits ReservationForm
    │
    ├── react-hook-form handleSubmit()
    │       └── zodResolver(reservationSchema)
    │               └── Validates + coerces guests: string → number
    │
    └── onSubmit(data: ReservationFormData)
            └── services/reservation.ts submitReservation(data)
                    ├── Phase 1-3: POST /api/reservation (Next.js route)
                    │       └── Server validates with same reservationSchema
                    │       └── Returns { ok: true } | { ok: false, error }
                    └── Phase 4b: Persists to database (Prisma / Supabase)
```

### Language Switch Flow

```
User clicks language toggle
    │
    └── useLanguageStore.toggle()
            ├── Computes next language
            ├── localStorage.setItem('mitaya-lang', next)
            └── set({ language: next })
                    └── Only components subscribing to language re-render
                        (Cart components are NOT affected — isolated store)
```

---

## 7. Service Layer

Introduced in Phase 1 to extract mock I/O from UI components (R-09).

```typescript
// services/reservation.ts
// Phase 1: mock setTimeout → Phase 4: real fetch()
export async function submitReservation(
  data: ReservationFormData
): Promise<ReservationResult>

// services/menu.ts
// Phase 1: re-export MENU_ITEMS → Phase 4: GET /api/menu with fallback
export async function getMenuItems(): Promise<MenuItem[]>
```

**Design principle:** Services have the same interface in all phases.
`ReservationPage.tsx` does not change when the backend is wired —
only `services/reservation.ts` is updated.

---

## 8. Storage Safety

`lib/safeStorage.ts` wraps all localStorage operations with Zod validation,
introduced in Phase 0 to eliminate the White Screen of Death risk (R-03).

```typescript
// Before (unsafe — crashes on malformed data)
JSON.parse(localStorage.getItem('mitaya-cart') || '[]')

// After (safe — returns fallback on any error)
safeRead('mitaya-cart', CartItemsSchema, [])
```

**`CartItemsSchema`** in `types.ts` uses `z.enum` for the `category` field,
which is stricter than `z.string()`. Malformed or stale data is rejected and
the cart falls back to an empty array rather than crashing.

```
safeRead()
    ├── localStorage.getItem(key)          → null? return fallback
    ├── JSON.parse(raw)                    → throws? return fallback
    └── CartItemsSchema.safeParse(parsed)  → fails? return fallback
                                             → success: return data
```

> **Status:** `safeStorage.ts` is created and used by Zustand stores.
> AppContext still uses the old `JSON.parse` pattern — manual wiring required.

---

## 9. i18n

### Architecture (Phase 2)

```
lib/i18n.ts  (react-i18next init)
    └── locales/en.json
    └── locales/zh-TW.json

Usage in components:
  const { t } = useTranslation()
  t('res.title')  // same key structure as AppContext custom i18n
```

**Key design decision:** The `t()` key structure in `locales/` is identical
to the existing AppContext custom i18n keys. Components do not need to change
keys when migrating — only the import source changes.

### Migration Status

```
Before:  const { t } = useApp()          ← AppContext custom i18n
After:   const { t } = useTranslation()  ← react-i18next
```

The `lib/i18n.ts` initialisation must be imported in `index.tsx` before
`<App />` renders. This manual step is pending.

---

## 10. Testing Strategy

### Test Pyramid

```
                    ┌─────────────────┐
                    │   E2E (planned) │  cypress-axe / playwright
                    │                 │
              ┌─────┴─────────────────┴─────┐
              │   Component tests (Phase 3)  │  @testing-library/react
              │   CartDrawer, useCustomRouter│
        ┌─────┴──────────────────────────────┴─────┐
        │   Schema + unit tests (Phase 1)           │  Vitest (pure functions)
        │   reservationSchema, calcTotal, i18n t()  │
        └───────────────────────────────────────────┘
```

### Test Files

| File | Type | Count | Notes |
|------|------|-------|-------|
| `tests/smoke.test.ts` | Unit / Schema | 17 | No DOM dependency |
| `tests/components/CartDrawer.test.tsx` | Integration | 4 | Zustand store |
| `tests/components/useCustomRouter.test.ts` | Integration | 3 | hashchange event |

### Key Design Decisions

**No generics on `useForm`:** `useForm()` receives no type parameters,
letting `zodResolver` infer `TFieldValues` and `TTransformedValues` automatically.
This avoids the Zod v4 `z.coerce.number()` Input type (`unknown`) conflict (TS2322).

**`tsconfig.vitest.json` isolation:** Test files reference `vitest/globals` types
via a separate tsconfig, preventing these types from polluting the production build.

---

## 11. Feature-Sliced Design Migration

Phase 3 scaffolded the FSD directory structure. Migration is gradual — one feature per PR.

### Layer Rules (strict)

```
app/       → allowed to import from any layer
pages/     → widgets, features, entities, shared
widgets/   → features, entities, shared
features/  → entities, shared
entities/  → shared
shared/    → nothing (no project imports)
```

**Violation:** A component in `shared/` importing from `features/` breaks the contract
and will be rejected in code review.

### Migration Status

```
features/cart/      ← scaffold created; model/ re-exports from store/
                       ui/CartSummary is stubbed (commented out in index.ts)
entities/menu-item/ ← re-exports MenuItem from root types.ts
entities/reservation/ ← re-exports reservationSchema from root types.ts
shared/lib/         ← re-exports safeStorage
shared/config/      ← APP_NAME, STORAGE_KEYS constants
```

**Next migration target:** Move `CartDrawer.tsx` into `features/cart/ui/`
and uncomment the `CartSummary` export in `src/features/cart/index.ts`.

---

## 12. Backend Layer (Phase 4)

Next.js App Router API routes coexist with Vite during migration.
Vite remains the primary development tool until full migration is verified.

### API Routes

| Route | Method | Status | Notes |
|-------|--------|--------|-------|
| `/api/menu` | GET | Active | Returns `MENU_ITEMS`; future: DB query |
| `/api/reservation` | POST | Active | Validates with `reservationSchema`; future: DB write |
| `/api/cart` | GET/POST | Stub | Phase 4b: requires auth |

### Validation Contract

The same `reservationSchema` from `types.ts` is used for:
- Frontend form validation (react-hook-form + zodResolver)
- API route validation (`reservationSchema.safeParse(body)`)
- TypeScript types (`z.infer<typeof reservationSchema>`)

This ensures frontend and backend validation are always in sync.

### Migration Path

```
Phase 4a (current):
  Vite dev server + Next.js API routes (coexist)
  services/ calls /api/* endpoints

Phase 4b (next):
  Add authentication (NextAuth.js)
  Add database (Prisma + PlanetScale / Supabase)
  Migrate /api/cart to server session

Phase 4c (future):
  Full Next.js migration
  Remove Vite
  Server Components for menu page
```

---

## 13. Known Technical Debt

Ordered by risk score (from `audit/08-risks.md`):

| Risk | Score | Status | Location | Fix |
|------|-------|--------|----------|-----|
| Bus Factor 1 | 25 | 🟡 Mitigated | Whole project | CODEOWNERS + PR template added (Phase 3) |
| AppContext re-renders | 15 | 🟡 In Progress | `context/AppContext.tsx` | Zustand stores created; UI migration pending |
| localStorage crash (WSOD) | 16 | 🟡 Partial | `context/AppContext.tsx` | `safeStorage.ts` created; wiring pending |
| Missing CI | 10 | ✅ Resolved | `.github/workflows/` | GitHub Actions added (Phase 1) |
| Phantom `docs/adr/` | 12 | ✅ Resolved | `docs/adr/` | Three ADRs created (Phase 0) |
| Stale Vite/Vitest | 12 | ✅ Resolved | `package.json` | Upgraded to latest (Phase 2) |
| Infrastructure leak | 9 | ✅ Resolved | `services/` | Extracted to service layer (Phase 1) |
| Flat root structure | — | 🟡 In Progress | `src/` | FSD scaffold created (Phase 3) |

**Inflection point warning (from `audit/08-risks.md`):**
The AppContext God Object will become a blocking bottleneck when adding the next major
feature (e.g. user authentication). The cost of refactoring at that point will exceed
the cost of the feature itself. Complete the Zustand migration before Phase 4b.

---

## 14. Architecture Decision Records

All ADRs are in [`docs/adr/`](./docs/adr/).

| ADR | Title | Status | Trigger for change |
|-----|-------|--------|--------------------|
| [0001](./docs/adr/0001-custom-hash-router.md) | Custom hash-based router | Accepted | Adding `/menu/:id` or migrating to Next.js |
| [0002](./docs/adr/0002-app-context-god-object.md) | AppContext God Object | Accepted (transitional) | Adding 4th domain to state or measurable jank |
| [0003](./docs/adr/0003-manual-shadcn-components.md) | Manual shadcn/ui components | Accepted | Adding 3rd component type (Select, Dialog, Toast) |

To propose a new architectural decision, open a PR that adds `docs/adr/000N-title.md`
following the existing format (Status · Context · Decision · Consequences).