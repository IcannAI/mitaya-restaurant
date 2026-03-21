# Contributing to Mitaya's Restaurant Showcase

This guide covers how to set up your development environment, submit contributions, and follow the project's conventions.

---

## Development Environment Setup

### System Requirements

| Tool | Version |
|------|---------|
| Node.js | >= 20.x (LTS recommended) |
| npm | >= 10.x |
| Git | Any modern version |

### Quick Start

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/mitaya-restaurant.git
cd mitaya-restaurant

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# Opens http://localhost:5173

# 4. Run type check
npx tsc --noEmit

# 5. Run tests
npm test

# 6. Run test coverage
npm run test:coverage
```

### Project Structure

```
mitaya-restaurant/
├── components/               # Shared UI components
│   └── ui/                   # Base components (Button, Input)
├── context/                  # AppContext — transitional state management
├── store/                    # Zustand stores (Phase 2)
│   ├── cart.store.ts         # Cart state — items, total, itemCount
│   ├── language.store.ts     # Language toggle — isolated from cart
│   └── index.ts              # Barrel export
├── hooks/                    # Custom hooks
│   ├── useCustomRouter.ts    # Hash-based SPA router
│   ├── useMenuFilter.ts      # useTransition-powered filter (Phase 3)
│   ├── useOptimisticCart.ts  # useOptimistic cart feedback (Phase 3)
│   └── usePageLoader.ts      # lazy() + Suspense code splitting (Phase 3)
├── lib/                      # Utilities
│   ├── safeStorage.ts        # Zod-guarded localStorage wrapper (Phase 0)
│   └── i18n.ts               # react-i18next initialisation (Phase 2)
├── services/                 # API service layer (Phase 1)
│   ├── reservation.ts        # submitReservation() — calls /api/reservation
│   └── menu.ts               # getMenuItems() — calls /api/menu with fallback
├── locales/                  # i18n locale files (Phase 2)
│   ├── en.json
│   └── zh-TW.json
├── pages/                    # Route-level components
│   ├── HomePage.tsx
│   ├── MenuPage.tsx
│   └── ReservationPage.tsx
├── docs/adr/                 # Architecture Decision Records (Phase 0)
│   ├── 0001-custom-hash-router.md
│   ├── 0002-app-context-god-object.md
│   └── 0003-manual-shadcn-components.md
├── src/                      # FSD migration target (Phase 3 scaffold)
│   ├── features/cart/        # Cart feature — public API via index.ts
│   ├── entities/             # Domain models (menu-item, reservation)
│   └── shared/               # Truly reusable utilities and config
├── tests/                    # Test files
│   ├── smoke.test.ts         # Pure function + Zod schema tests
│   └── components/           # Component integration tests (Phase 3)
├── constants.ts              # Static data and menu items
├── types.ts                  # TypeScript types + Zod schemas
└── App.tsx                   # Application entry point
```

> **Note:** All source folders currently sit at the project root rather than under `src/`. This is a known architectural issue. Gradual FSD migration is underway via `src/features/`. See [ADR-0002](./docs/adr/0002-app-context-god-object.md).

---

## Contribution Workflow

### 1. Create a Branch

```bash
# Feature development
git checkout -b feat/your-feature-name

# Bug fix
git checkout -b fix/issue-description

# Documentation
git checkout -b docs/what-you-updated

# Security patch
git checkout -b security/cve-or-description
```

### 2. Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body: detailed explanation]

[optional footer: linked issue, e.g. Closes #12]
```

**Type reference:**

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, no logic change |
| `refactor` | Refactor without adding features or fixing bugs |
| `test` | Adding or updating tests |
| `chore` | Build tools, dependency updates |
| `security` | Security patches |

**Examples:**

```bash
# Good commits
feat(cart): add quantity increment with keyboard support
fix(form): correct date validation for past dates
docs(readme): sync tech stack with actual implementation
chore(deps): upgrade vite to 6.5.0 to patch rollup CVE
refactor(context): migrate cart state to Zustand store
test(schema): add reservationSchema date refine edge cases
security(storage): replace JSON.parse with safeRead + Zod validation

# Avoid
Addimprovements
fix
Update README.md
wip
```

### 3. Open a Pull Request

- Title must follow Conventional Commits format
- Describe what changed and why
- Attach screenshots for any visual changes
- Confirm the following all pass locally before opening:

```bash
npx tsc --noEmit       # zero type errors
npm run build          # production build succeeds
npm test -- --run      # all tests pass
```

The CI pipeline (GitHub Actions) runs these automatically on every PR.

---

## Testing

```bash
# Run all tests
npm test

# Watch mode (during development)
npm test -- --watch

# Generate coverage report
npm run test:coverage
```

### Current Test Coverage

| Suite | File | Tests |
|-------|------|-------|
| Cart logic | `tests/smoke.test.ts` | 4 — calcTotal boundary values |
| Form validation | `tests/smoke.test.ts` | 3 — guests range, name trim |
| i18n | `tests/smoke.test.ts` | 3 — key lookup, fallback |
| Schema — guests | `tests/smoke.test.ts` | 3 — coerce, boundary 0/11 |
| Schema — date | `tests/smoke.test.ts` | 2 — past rejection, future acceptance |
| Schema — name | `tests/smoke.test.ts` | 2 — min-length enforcement |
| Cart store | `tests/components/CartDrawer.test.tsx` | 4 — Zustand integration |
| Router | `tests/components/useCustomRouter.test.ts` | 3 — hash navigation |

### Priority Areas for New Tests

When adding tests, focus on these areas in order:

1. `CartItemsSchema` — localStorage Zod validation edge cases
2. `ReservationForm` — submit empty form, successful submission flow
3. `useMenuFilter` — filter by category, vegetarian flag, query string
4. `useCustomRouter` — route change triggers correct page render

---

## Architecture Notes for Contributors

### Before modifying AppContext

Read [ADR-0002](./docs/adr/0002-app-context-god-object.md) first.
`AppContext` is being migrated to Zustand. New state should go into `store/cart.store.ts` or `store/language.store.ts`, not into AppContext.

### Before modifying the router

Read [ADR-0001](./docs/adr/0001-custom-hash-router.md).
PRs that migrate `useCustomRouter` to `react-router-dom` require an ADR update and architecture discussion before implementation.

### Before adding a new UI component

Read [ADR-0003](./docs/adr/0003-manual-shadcn-components.md).
If the component exists in shadcn/ui, prefer migrating to the full shadcn/ui setup rather than adding another manual implementation.

### FSD import rules

The `src/` directory follows Feature-Sliced Design layer rules:

```
app/ → pages/ → widgets/ → features/ → entities/ → shared/
```

Lower layers cannot import from higher layers. `shared/` cannot import from any other layer. Violations will be flagged in code review.

---

## Known Limitations

| Area | Current State | Notes |
|------|---------------|-------|
| State management | AppContext + Zustand (transitional) | Zustand stores created (Phase 2); UI component migration pending |
| i18n | react-i18next installed; AppContext custom i18n still active | Wire `import './lib/i18n'` in index.tsx to complete migration |
| Routing | Custom hash router | Migration to react-router-dom pending ADR discussion (ADR-0001) |
| localStorage safety | `safeStorage.ts` created (Phase 0) | Needs to be wired into AppContext to take effect |
| CI/CD | GitHub Actions running (Phase 1) | Lighthouse CI added (Phase 4); Codecov badge pending |
| Backend | Next.js API routes scaffolded (Phase 4) | Vite still primary; full Next.js migration in progress |

---

## Reporting Issues

When reporting a bug, please include:

1. Browser and version
2. Steps to reproduce (step-by-step)
3. Expected behaviour vs actual behaviour
4. Relevant screenshots or console errors
5. Any related `localStorage` contents if the issue involves cart or language state

---

## Code of Conduct

This project welcomes contributors of all experience levels. Please be respectful and constructive in all interactions.

