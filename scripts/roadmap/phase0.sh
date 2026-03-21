#!/usr/bin/env bash
# ============================================================
# PHASE 0 — Emergency Scripts
# Mitaya Restaurant · FAANG-grade execution
# Constraint: ZERO frontend UI changes
# Usage: bash phase0.sh [--no-commit]
# ============================================================
set -euo pipefail

# ── Flag parsing ──────────────────────────────────────────────
NO_COMMIT=false
for arg in "$@"; do
  [[ "$arg" == "--no-commit" ]] && NO_COMMIT=true
done
if [ "$NO_COMMIT" = true ]; then
  echo -e "\033[0;33m[--no-commit] Files will be created but NOT staged or committed.\033[0m"
fi

# Helper: stage + commit, or print instructions when --no-commit
do_commit() {
  local files="$1"
  local message="$2"
  if [ "$NO_COMMIT" = true ]; then
    echo ""
    echo -e "\033[0;33m── Skipped commit (--no-commit). Run manually when ready: ──\033[0m"
    echo "  git add $files"
    printf "  git commit -m '%s'\n" "$(echo "$message" | head -1)"
    echo ""
  else
    eval "git add $files"
    git diff --cached --quiet || git commit -m "$message"
  fi
}


YELLOW='\033[0;33m'; GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'; BOLD='\033[1m'
step() { echo -e "\n${BOLD}${YELLOW}▶ $1${NC}"; }
ok()   { echo -e "${GREEN}✓ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; exit 1; }

# ── Pre-flight ────────────────────────────────────────────────
step "Pre-flight checks"
[ -f "package.json" ] || fail "Not in project root. cd to mitaya-restaurant first."
[ -d ".git"         ] || fail ".git not found. Not a git repository."
ok "Project root confirmed"

# ─────────────────────────────────────────────────────────────
# R-02: Remove node_modules from git tracking
# Risk score: 20 (CRITICAL)
# ─────────────────────────────────────────────────────────────
step "R-02 · Removing node_modules from git tracking"

# 1. Append to .gitignore (idempotent)
ENTRIES=(
  "# Build output"
  "dist/"
  ""
  "# Dependencies — never commit"
  "node_modules/"
  ""
  "# macOS"
  ".DS_Store"
  ""
  "# Test coverage"
  "coverage/"
  ""
  "# Env files"
  ".env*.local"
)

for entry in "${ENTRIES[@]}"; do
  grep -qxF "$entry" .gitignore 2>/dev/null || echo "$entry" >> .gitignore
done
ok ".gitignore updated"

# 2. Remove from index (keeps local files untouched)
if git ls-files --error-unmatch node_modules &>/dev/null 2>&1; then
  git rm -r --cached node_modules/ --quiet
  ok "node_modules removed from git index"
else
  ok "node_modules already untracked — skipping"
fi

if git ls-files --error-unmatch dist &>/dev/null 2>&1; then
  git rm -r --cached dist/ --quiet
  ok "dist/ removed from git index"
fi

if git ls-files --error-unmatch .DS_Store &>/dev/null 2>&1; then
  git rm --cached .DS_Store --quiet 2>/dev/null || true
  find . -name ".DS_Store" -not -path "./.git/*" | \
    xargs git rm --cached --quiet 2>/dev/null || true
  ok ".DS_Store removed from git index"
fi

# 3. Commit
do_commit ".gitignore" "chore(git): add dist, node_modules, .DS_Store to .gitignore

Remove build output and dependencies from version control.
- node_modules: causes ~10x repo bloat and environment drift (R-02, score 20)
- dist/: regenerated on every build, should not be committed
- .DS_Store: macOS system files

Refs: audit/08-risks.md R-02"
ok "Commit 1 of 2 handled (.gitignore)"

# ─────────────────────────────────────────────────────────────
# R-03: Fix unsafe localStorage parsing
# Risk score: 16 (HIGH) — prevents White Screen of Death
# ─────────────────────────────────────────────────────────────
step "R-03 · Patching unsafe localStorage (code scaffold)"

# Create the safe storage utility
mkdir -p lib
cat > lib/safeStorage.ts << 'TS'
/**
 * safeStorage.ts
 * Type-safe localStorage wrapper with Zod validation.
 *
 * Why: JSON.parse(localStorage.getItem(...)) without try-catch causes
 * White Screen of Death if data is malformed (R-03, risk score 16).
 *
 * Usage:
 *   const cart = safeRead('cart', CartItemsSchema, [])
 *   safeWrite('cart', updatedCart)
 */
import { z } from 'zod'

export function safeRead<T>(
  key: string,
  schema: z.ZodType<T>,
  fallback: T
): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const result = schema.safeParse(JSON.parse(raw))
    return result.success ? result.data : fallback
  } catch {
    return fallback
  }
}

export function safeWrite<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage quota exceeded or private browsing — fail silently
  }
}

export function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // Fail silently
  }
}
TS
ok "lib/safeStorage.ts created"

# ─────────────────────────────────────────────────────────────
# R-06: Create docs/adr/ directory with initial records
# Severity: P1 (phantom reference in README)
# ─────────────────────────────────────────────────────────────
step "R-06 · Materializing docs/adr/ (phantom README reference)"
mkdir -p docs/adr

cat > docs/adr/README.md << 'MD'
# Architecture Decision Records

This directory documents architectural decisions made in the
mitaya-restaurant project. Each file follows the ADR format:
Status · Context · Decision · Consequences.

| ID | Title | Status |
|----|-------|--------|
| [0001](./0001-custom-hash-router.md) | Custom hash-based router | Accepted |
| [0002](./0002-app-context-god-object.md) | AppContext as unified state | Accepted (transitional) |
| [0003](./0003-manual-shadcn-components.md) | Manual shadcn/ui components | Accepted |
MD

cat > docs/adr/0001-custom-hash-router.md << 'MD'
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
MD

cat > docs/adr/0002-app-context-god-object.md << 'MD'
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
MD

cat > docs/adr/0003-manual-shadcn-components.md << 'MD'
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
MD

do_commit "docs/ lib/" "docs(adr): materialize docs/adr/ directory with 3 initial ADRs

Resolves phantom README reference to non-existent docs/adr/ (R-06).
Three ADRs document existing architectural decisions:
  - 0001: custom hash router rationale and migration trigger
  - 0002: AppContext God Object as transitional design
  - 0003: manual shadcn/ui component subset

Also adds lib/safeStorage.ts scaffold for R-03 localStorage fix.
Integration into AppContext is a separate commit (see Phase 1).

Refs: audit/02-docs.md P1, audit/08-risks.md R-06"
ok "Commit 2 of 2 handled (docs/adr + lib/)"

echo -e "\n${BOLD}${GREEN}Phase 0 complete.${NC}"
echo -e "Next steps:"
echo -e "  1. Manually update AppContext.tsx to use lib/safeStorage.ts (see Phase 1 script)"
echo -e "  2. Run: bash scripts/phase1.sh"