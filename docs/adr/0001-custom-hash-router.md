# ADR-0001: Custom hash-based router

**Status**: Accepted
**Date**: 2026-02

## Context
The project needed SPA routing for 3 pages (Home / Menu / Reservation).
`react-router-dom` was available but adds abstraction overhead for an MVP.

## Decision
Implement `hooks/useCustomRouter.ts` using `window.location.hash`
and the `hashchange` event.

## Consequences
- Zero additional dependency for routing
- Demonstrates understanding of browser history APIs
- **Cost**: No nested routes, no route params, no code splitting per route
- **Limit**: Incompatible with SSR (Next.js migration will require full rewrite)
- `react-router-dom` remains installed as unused dep — tracked in Known Issues

## Migration trigger
When the app adds a second-level route (e.g. `/menu/:id`) or migrates to Next.js.
