# Mitaya's Restaurant — Modern React SPA

> A production-quality restaurant showcase built with React 19, TypeScript, and modern frontend engineering practices.
> Demonstrates system architecture thinking, accessibility-first design, and engineering documentation.

**→ [Live Demo](https://mitaya-restaurant.vercel.app)** &nbsp;|&nbsp; **→ [Architecture](./docs/adr/)** &nbsp;|&nbsp; **→ [Contributing](./CONTRIBUTING.md)**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.5-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-ISC-green)

---

## System Architecture

The application follows a **feature-oriented flat structure** with a single shared context layer.
Planned migration to Feature-Sliced Design (FSD) is tracked in the Roadmap.

```
index.tsx
└── App.tsx
    ├── context/AppContext.tsx     # Global state: cart / language / UI toggles
    ├── hooks/useCustomRouter.ts   # Hash-based SPA routing (window.location.hash)
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── MenuPage.tsx
    │   └── ReservationPage.tsx
    └── components/
        ├── Layout.tsx
        ├── CartDrawer.tsx
        └── ui/                    # Button, Input (shadcn/ui-inspired)
```

**Key architectural decisions** (documented in [`docs/adr/`](./docs/adr/)):

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | React Context | Zero-dependency MVP; planned Zustand migration |
| Routing | Custom `useCustomRouter` | Demonstrates hash routing mechanics; `react-router-dom` deprioritized |
| i18n | Custom implementation | Avoids `react-i18next` overhead for 2-language MVP |
| Form validation | react-hook-form + Zod v4 | Schema-driven, single source of truth for types and validation |

> **Note on AppContext:** Currently a God Object managing cart, language, and UI state.
> This is an acknowledged design tradeoff for MVP speed. Refactor tracked in [ADR-0002](./docs/adr/0002-app-context-god-object.md).

---

## Tech Stack

| Layer | Current | Planned |
|-------|---------|---------|
| State | React Context | Zustand |
| i18n | Custom implementation | react-i18next |
| Routing | `useCustomRouter` (hash) | Evaluate react-router-dom |
| Component library | Manual Button / Input | Full shadcn/ui |
| Testing | Vitest (smoke tests) | +@testing-library/react, coverage CI |
| CI/CD | None | GitHub Actions (lint / build / security scan) |

**Full dependency list:**

| Category | Library | Version |
|----------|---------|---------|
| Framework | React | 19 |
| Language | TypeScript | 5.8 |
| Build | Vite | 6.5 |
| Styling | Tailwind CSS + clsx + tailwind-merge | latest |
| Animation | framer-motion | 12 |
| Forms | react-hook-form + zod | 7 + 4 |
| Icons | lucide-react | latest |

---

## Core Functionality

- **Menu module** — category tabs, keyword search, vegetarian / price filters
- **Shopping cart** — add / remove / quantity controls, subtotal, localStorage persistence
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
`reservationSchema` in `types.ts` is the single source of truth —
it drives form validation, TypeScript types (`z.infer`), and future API request validation.

```ts
// One schema → validation + types, always in sync
export const reservationSchema = z.object({ ... })
export type ReservationFormData = z.infer<typeof reservationSchema>
```

Full ADR documentation: [`docs/adr/`](./docs/adr/)

---

## Testing

**Current coverage: smoke tests (pure functions, no DOM dependency)**

```bash
npm test                # run all tests
npm run test:coverage   # generate coverage report
```

| Suite | Tests | Scope |
|-------|-------|-------|
| Cart logic | 4 | calcTotal boundary values |
| Form validation | 5 | guests range, name trim |
| i18n | 3 | key lookup, fallback behavior |

**Phase 2 (planned):** Component tests via `@testing-library/react`
— CartDrawer interactions, ReservationForm submission, MenuPage tab switching.

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

### Short-term
- [ ] Patch rollup CVE — upgrade vite to 6.5.0
- [x] Remove unused deps — react-router-dom, react-markdown
- [x] Add LICENSE (ISC)
- [x] Add CONTRIBUTING.md
- [x] Vitest smoke tests
- [ ] GitHub Actions CI (lint + build + npm audit)

### Mid-term (tech debt)
- [ ] Migrate state: React Context → Zustand
- [ ] Migrate i18n: custom → react-i18next
- [ ] Expand test coverage: components + schema tests
- [ ] Feature-Sliced Design (FSD) folder restructure

### Long-term
- [ ] Real backend API (menu data, reservation submission)
- [ ] Next.js App Router + Server Components
- [ ] PWA (offline menu, push notifications)
- [ ] Visual regression testing + Lighthouse CI

---

## Known Issues

| ID | Severity | Status | Description | Fix |
|----|----------|--------|-------------|-----|
| S-01 | **High** | 🔴 Open | rollup CVE [GHSA-mw96-cpmx-2vgc](https://github.com/advisories/GHSA-mw96-cpmx-2vgc) — Arbitrary File Write via Path Traversal | Upgrade vite to `>=6.5.0` once available on npm registry. Current: `6.4.1` |
| A-01 | Medium | 🟡 Planned | AppContext God Object — cart / language / UI in one context causes unnecessary re-renders | Zustand migration (see Roadmap) |
| A-02 | Low | 🟡 Planned | Flat root structure (no `src/`) deviates from Vite convention | FSD migration (see Roadmap) |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, commit conventions, and known limitations.

---

## License

ISC © [IcannAI](https://github.com/IcannAI)