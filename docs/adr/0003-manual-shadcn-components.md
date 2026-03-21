# ADR-0003: Manual shadcn/ui component implementation

**Status**: Accepted
**Date**: 2026-02

## Context
The project aims to use shadcn/ui for accessible, well-designed components.
However, full shadcn/ui setup requires a CLI initialization step and
introduces a Radix UI dependency tree.

## Decision
Manually implement the subset of components needed:
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`

Components follow shadcn/ui's design language (Tailwind classes, variant pattern)
but without the Radix dependency.

## Consequences
- Smaller bundle, no Radix overhead for 2-component need
- Full a11y responsibility falls on manual implementation
- **Cost**: Does not scale — adding more components requires manual work
- README's "shadcn/ui" claim is therefore partially inaccurate (documented)

## Migration trigger
When adding a 3rd component type (Select, Dialog, Toast, etc.).
