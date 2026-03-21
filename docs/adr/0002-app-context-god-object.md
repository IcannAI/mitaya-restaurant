# ADR-0002: AppContext as unified state (God Object)

**Status**: Accepted (transitional — planned Zustand migration)
**Date**: 2026-02

## Context
MVP stage required fast delivery of shared state across:
- Shopping cart (items, qty, total)
- Language toggle (zh-TW / en)
- UI state (CartDrawer open/close)

## Decision
Single React Context (`context/AppContext.tsx`) manages all three domains.

## Consequences
- Zero extra dependencies, fast to implement
- **Cost**: Any state change triggers re-render across ALL `useApp()` consumers
- `useMemo` wrapping is a short-term mitigation (Phase 1 task)
- God Object pattern makes testing harder — each consumer gets the entire state

## Migration plan (Phase 2)
Split into `useCartStore` and `useLanguageStore` via Zustand.
Trigger: when adding a 4th domain (e.g. user auth state) or when
performance profiling shows measurable jank.
