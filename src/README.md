# src/ — Feature-Sliced Design

This directory is the target state for FSD migration.
Current code lives in the root flat structure (components/, pages/, etc.).

## Migration strategy
One feature per PR. Start with `features/cart` as it's the most isolated.

## Layer rules (strict — enforced via eslint-plugin-fsd in Phase 4)
- app/       → global providers, router, i18n init
- pages/     → thin route entry points only (no business logic)
- widgets/   → cross-feature composite components (e.g. CartDrawer)
- features/  → self-contained business units with public API (index.ts)
- entities/  → domain models and schemas (no UI)
- shared/    → truly reusable (ui components, utils, config)

## Import rules
Lower layers CANNOT import from higher layers.
features/ cannot import from pages/ or widgets/.
shared/ cannot import from any other layer.
