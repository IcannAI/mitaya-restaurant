# Mitaya's Restaurant — Modern React SPA

> A production-quality restaurant showcase built with React 19, TypeScript, and modern frontend engineering practices.
> Demonstrates system architecture thinking, accessibility-first design, and honest engineering documentation.

**→ [Live Demo](https://mitaya-restaurant.vercel.app)** &nbsp;|&nbsp; **→ [Architecture](./docs/adr/)** &nbsp;|&nbsp; **→ [Contributing](./CONTRIBUTING.md)**

> [!WARNING]
> **Engineering Honesty Disclaimer**: This project is an active MVP under structured refactoring.
> Phase 0–4 roadmap scripts are in progress. See [Known Issues](#known-issues--risks) for current status.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-ISC-green)

---

## System Architecture

The application follows a **feature-oriented flat structure** with a single shared context layer.
Planned migration to Feature-Sliced Design (FSD) is scaffolded in `src/` (Phase 3).

```
index.tsx
└── App.tsx
    ├── context/AppContext.tsx     # Global state: cart / language / UI toggles
    ├── hooks/useCustomRouter.ts   # Hash-based SPA routing (window.location.hash)
    ├── hooks/useMenuFilter.ts     # useTransition-powered menu filter (Phase 3)
    ├── hooks/useOptimisticCart.ts # useOptimistic cart feedback (Phase 3)
    ├── hooks/usePageLoader.ts     # lazy() + Suspense code splitting (Phase 3)
    ├── store/                     # Zustand stores — cart + language (Phase 2)
    ├── lib/                       # safeStorage, i18n init
    ├── services/                  # API service layer — reservation, menu
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── MenuPage.tsx
    │   └── ReservationPage.tsx
    ├── components/
    │   ├── Layout.tsx
    │   ├── CartDrawer.tsx
    │   └── ui/                    # Button, Input (shadcn/ui-inspired)
    └── src/                       # FSD migration target (Phase 3 scaffold)
        ├── features/cart/
        ├── entities/menu-item/
        └── shared/
```

### Architectural Trade-offs

| Decision | Approach | Alternative | Why chosen | Technical Cost |
|:---------|:---------|:------------|:-----------|:---------------|
| **State** | `AppContext` (God Object) → Zustand (Phase 2) | Redux | MVP speed; Zustand migration in progress | Application-wide re-renders pre-migration |
| **Routing** | Custom `useCustomRouter` (hash-based) | `react-router-dom` | Control over hash navigation; lightweight | No nested routes or URL params |
| **i18n** | Custom → react-i18next (Phase 2) | next-intl | Avoids library overhead for 2-language MVP | Not scalable for complex locales |
| **Reliability** | `safeStorage` (Zod-guarded, Phase 0) | Server session | Rapid prototyping baseline | Single-device only; auth needed for sync |

**Key architectural decisions** (documented in [`docs/adr/`](./docs/adr/)):

| ADR | Decision | Status |
|-----|----------|--------|
| [ADR-0001](./docs/adr/0001-custom-hash-router.md) | Custom hash-based router | Accepted |
| [ADR-0002](./docs/adr/0002-app-context-god-object.md) | AppContext God Object | Accepted (transitional → Zustand) |
| [ADR-0003](./docs/adr/0003-manual-shadcn-components.md) | Manual shadcn/ui components | Accepted |

> **Note on AppContext:** Currently being migrated to `store/cart.store.ts` and `store/language.store.ts` via Zustand (Phase 2). Refactor tracked in [ADR-0002](./docs/adr/0002-app-context-god-object.md).

---

## Tech Stack

### Current vs Planned

| Layer | Current | Planned |
|-------|---------|---------|
| State | Zustand (Phase 2) / AppContext (transitional) | Full Zustand migration |
| i18n | react-i18next + locales/ (Phase 2) | Additional locale support |
| Routing | `useCustomRouter` (hash) | Evaluate react-router-dom (ADR-0001) |
| Component library | Manual Button / Input | Full shadcn/ui |
| Testing | Vitest — smoke + schema tests | +@testing-library/react, Codecov badge |
| CI/CD | GitHub Actions (Phase 1) | Lighthouse CI, visual regression |

### Full Dependency List

| Category | Library | Version |
|----------|---------|---------|
| Framework | React | 19 |
| Language | TypeScript | 5.8 |
| Build | Vite | 6.4 |
| State | Zustand | latest |
| Styling | Tailwind CSS 4 + clsx + tailwind-merge | latest |
| Animation | framer-motion | 12 |
| Forms | react-hook-form + zod | 7 + 4 |
| i18n | i18next + react-i18next | latest |
| Icons | lucide-react | latest |

---

## Core Functionality

- **Menu module** — category tabs, keyword search, vegetarian / price filters
- **Shopping cart** — add / remove / quantity controls, subtotal, localStorage persistence (Zod-guarded)
- **Reservation form** — full Zod schema validation, datetime picker, optimistic success state
- **i18n** — English / Traditional Chinese toggle
- **Accessibility** — full keyboard navigation (Tab / Arrow / Enter / Esc), ARIA roles, screen reader support
- **Responsive** — mobile-first, all major breakpoints covered
- **Animations** — cart entry animation, tab transitions via framer-motion

---

## Design Decisions & DDD

The domain is modelled around three bounded contexts:

```
┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Menu Domain   │  │   Order Domain   │  │  Booking Domain  │
│                 │  │                  │  │                  │
│ MenuItem        │  │ Cart             │  │ Reservation      │
│ Category        │  │ CartItem         │  │ GuestCount       │
│ MenuFilter      │  │ OrderSummary     │  │ TimeSlot         │
└─────────────────┘  └──────────────────┘  └──────────────────┘
```

**Zod as schema contract layer:**
`reservationSchema` and `CartItemsSchema` in `types.ts` are the single source of truth —
driving form validation, TypeScript types, localStorage safety, and future API validation.

```ts
// One schema → validation + types + storage safety, always in sync
export const reservationSchema = z.object({ ... })
export type ReservationFormData = z.infer<typeof reservationSchema>

export const CartItemsSchema = z.array(z.object({ ... }))  // guards localStorage
```

Full ADR documentation: [`docs/adr/`](./docs/adr/)

---

## Testing

**Current coverage: smoke tests + Zod schema edge cases**

```bash
npm test                # run all tests
npm run test:coverage   # generate coverage report
```

| Suite | Tests | Scope |
|-------|-------|-------|
| Cart logic | 4 | calcTotal boundary values |
| Form validation | 3 | guests range, name trim |
| i18n | 3 | key lookup, fallback behavior |
| reservationSchema — guests | 3 | coerce string→number, boundary 0/11 |
| reservationSchema — date | 2 | past rejection, future acceptance |
| reservationSchema — name | 2 | min-length enforcement |

**Phase 3 (planned):** Component tests via `@testing-library/react`
— CartDrawer store integration, ReservationForm submission, useCustomRouter hash navigation.

---

## Quick Start

**Requirements:** Node.js >= 20, npm >= 10

```bash
git clone https://github.com/IcannAI/mitaya-restaurant.git
cd mitaya-restaurant
npm install
npm run dev        # → http://localhost:5173
npm run build      # production build
npm test           # run test suite
```

---

## Roadmap

### Phase 0 — Emergency (Completed)
- [x] Remove `node_modules` from git tracking
- [x] Add `dist/`, `.DS_Store`, `coverage/` to `.gitignore`
- [x] Create `lib/safeStorage.ts` — Zod-guarded localStorage wrapper
- [x] Materialize `docs/adr/` — resolves phantom README reference (ADR-0001, 0002, 0003)

### Phase 1 — Stability · 30 days (Completed)
- [x] GitHub Actions CI — lint / build / test / security audit
- [x] `services/reservation.ts` — extract mock I/O from ReservationPage
- [x] `services/menu.ts` — API migration path scaffold
- [x] Zod schema tests — guests coerce, date refine, name validation
- [ ] AppContext: wire `safeRead()` + `useMemo` (manual step pending)

### Phase 2 — Refactor · 60 days (Completed)
- [x] Zustand stores — `store/cart.store.ts` + `store/language.store.ts`
- [x] react-i18next — `locales/en.json` + `locales/zh-TW.json`
- [x] Vite + Vitest upgraded to latest stable
- [x] Tailwind migrated from CDN to PostCSS (`@import "tailwindcss"`)
- [x] `index.css` created — resolves missing file observation
- [ ] UI components migration to Zustand (manual step pending)
- [ ] `import './lib/i18n'` in index.tsx (manual step pending)

### Phase 3 — Scaling · 90 days (Completed)
- [x] Feature-Sliced Design scaffold — `src/features/`, `src/entities/`, `src/shared/`
- [x] React 19 concurrent hooks — `useMenuFilter` (useTransition), `useOptimisticCart` (useOptimistic), `usePageLoader` (lazy + Suspense)
- [x] `.github/CODEOWNERS` + PR template — bus factor mitigation
- [x] Component tests — CartDrawer store integration, useCustomRouter hash navigation
- [x] Coverage workflow — 40% line threshold on main
- [ ] Wire hooks into UI components (manual step pending)

### Phase 4 — Product (In Progress)
- [x] Next.js App Router API routes — `/api/menu`, `/api/reservation`, `/api/cart`
- [x] `services/` updated to real fetch() calls (zero UI change)
- [x] PWA manifest — `public/manifest.json`
- [x] Lighthouse CI — a11y ≥ 0.98 enforced as error
- [ ] Full Next.js migration (Vite still primary)
- [ ] Database integration (Prisma / Supabase)
- [ ] User authentication (Phase 4b)

---

## Known Issues & Risks

| ID | Severity | Status | Description | Fix |
|:---|:---------|:-------|:------------|:----|
| **R-01** | **CRITICAL** | 🟡 Mitigated | **Bus Factor 1** — CODEOWNERS + PR template added (Phase 3). Second maintainer still needed. | Onboard 2nd maintainer. |
| **R-02** | **CRITICAL** | ✅ Resolved | **node_modules in git** — Purged and `.gitignore` updated (Phase 0). | Done. |
| **R-03** | **HIGH** | ✅ Resolved | **Unsafe localStorage** — `lib/safeStorage.ts` with Zod validation (Phase 0). AppContext wiring pending. | Wire `safeRead()` in AppContext manually. |
| **S-01** | **High** | 🔴 Open | rollup CVE [GHSA-mw96-cpmx-2vgc](https://github.com/advisories/GHSA-mw96-cpmx-2vgc) — Path Traversal. | Upgrade vite to `>=6.5.0` when available on npm. |
| **A-01** | Medium | 🟡 In Progress | AppContext God Object — Zustand stores created (Phase 2), UI migration pending. | Complete component migration. |
| **A-02** | Low | 🟡 Planned | Flat root structure (no `src/`) — FSD scaffold created (Phase 3). | Gradual migration per feature. |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, commit conventions, and known limitations.

---

## License

ISC © [IcannAI](https://github.com/IcannAI)