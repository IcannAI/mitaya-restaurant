#!/usr/bin/env bash
# ============================================================
# PHASE 1 — Stability Scripts (30 days)
# Mitaya Restaurant · FAANG-grade execution
# Constraint: ZERO frontend UI changes
# Usage: bash phase1.sh [--no-commit]
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

[ -f "package.json" ] || fail "Not in project root."

# ─────────────────────────────────────────────────────────────
# 1a. Apply R-03: Wire safeStorage into AppContext
# ─────────────────────────────────────────────────────────────
step "R-03 · Wiring safeStorage into AppContext"

# Check the scaffold exists from Phase 0
[ -f "lib/safeStorage.ts" ] || fail "lib/safeStorage.ts not found. Run phase0.sh first."

# Add CartItems Zod schema to types.ts (append only — no UI change)
cat >> types.ts << 'TS'

// ─── Storage Schemas (for safe localStorage parsing) ─────────
// Used by lib/safeStorage.ts to validate data on read.
// Adding schemas here does NOT affect runtime behaviour until
// AppContext is updated to use safeRead().
import { z as _z } from 'zod'
export const CartItemsSchema = _z.array(
  _z.object({
    id: _z.string(),
    name: _z.object({ en: _z.string(), 'zh-TW': _z.string() }),
    price: _z.number(),
    quantity: _z.number().int().min(0),
    category: _z.string(),
    isVegetarian: _z.boolean(),
    image: _z.string(),
    description: _z.object({ en: _z.string(), 'zh-TW': _z.string() }),
  })
)
TS
ok "CartItemsSchema appended to types.ts"

# Instructions for manual AppContext edit (cannot auto-edit without seeing the file)
cat << 'INSTRUCTIONS'

──────────────────────────────────────────────────────────────
MANUAL STEP REQUIRED — AppContext.tsx
──────────────────────────────────────────────────────────────
Find the line that reads cart from localStorage (something like):

  BEFORE:
    const [cart, setCart] = useState<CartItem[]>(
      JSON.parse(localStorage.getItem('mitaya-cart') || '[]')
    )

  AFTER:
    import { safeRead, safeWrite } from '../lib/safeStorage'
    import { CartItemsSchema } from '../types'

    const [cart, setCart] = useState<CartItem[]>(
      safeRead('mitaya-cart', CartItemsSchema, [])
    )

Also find where cart is persisted (useEffect with localStorage.setItem):

  BEFORE:
    localStorage.setItem('mitaya-cart', JSON.stringify(cart))

  AFTER:
    safeWrite('mitaya-cart', cart)

These changes are PURE LOGIC — zero UI impact.
──────────────────────────────────────────────────────────────
INSTRUCTIONS

# ─────────────────────────────────────────────────────────────
# 1b. Apply useMemo to AppContext (R-04a)
# ─────────────────────────────────────────────────────────────
step "R-04a · useMemo instructions for AppContext"

cat << 'INSTRUCTIONS'

──────────────────────────────────────────────────────────────
MANUAL STEP REQUIRED — AppContext.tsx useMemo
──────────────────────────────────────────────────────────────
Wrap the context value object and cartTotal in useMemo:

  BEFORE:
    const cartTotal = cart.reduce((sum, item) =>
      sum + item.price * item.quantity, 0)

    return (
      <AppContext.Provider value={{ cart, setCart, language, ... }}>

  AFTER:
    const cartTotal = useMemo(
      () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      [cart]
    )

    const contextValue = useMemo(
      () => ({ cart, setCart, language, setLanguage, cartTotal, ... }),
      [cart, language, cartTotal]
    )

    return (
      <AppContext.Provider value={contextValue}>

Zero UI change — only prevents unnecessary re-renders.
──────────────────────────────────────────────────────────────
INSTRUCTIONS

# ─────────────────────────────────────────────────────────────
# 1c. GitHub Actions CI Pipeline (R-08)
# ─────────────────────────────────────────────────────────────
step "R-08 · Creating GitHub Actions CI pipeline"
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'YAML'
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Type check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit
        name: TypeScript check

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 3

  test:
    name: Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --run
      - run: npm run test:coverage -- --run
        if: github.ref == 'refs/heads/main'

  security:
    name: Security audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm audit --audit-level=high
        continue-on-error: true
      - name: Check for known CVEs
        run: |
          echo "Checking rollup CVE status (GHSA-mw96-cpmx-2vgc)..."
          npm audit --json | python3 -c "
import sys, json
data = json.load(sys.stdin)
vulns = data.get('vulnerabilities', {})
if 'rollup' in vulns:
  print('WARNING: rollup CVE still present — upgrade vite when >=6.5.0 available')
else:
  print('OK: rollup CVE not detected')
" || true
YAML
ok ".github/workflows/ci.yml created"

# ─────────────────────────────────────────────────────────────
# 1d. Extract api/ service layer (R-09)
# ─────────────────────────────────────────────────────────────
step "R-09 · Creating services/ layer scaffold"
mkdir -p services

cat > services/reservation.ts << 'TS'
/**
 * services/reservation.ts
 *
 * Extracts mock I/O from ReservationPage.tsx (R-09, infrastructure leak).
 * Currently simulates a POST /api/reservation endpoint.
 *
 * Usage in ReservationPage.tsx:
 *   import { submitReservation } from '../services/reservation'
 *   const onSubmit = async (data: ReservationFormData) => {
 *     const result = await submitReservation(data)
 *     if (result.ok) setIsSuccess(true)
 *   }
 *
 * Future: Replace the mock implementation with a real fetch() call.
 * Zero changes required in ReservationPage.tsx when backend is ready.
 */
import type { ReservationFormData } from '../types'

export interface ReservationResult {
  ok: boolean
  error?: string
}

export async function submitReservation(
  data: ReservationFormData
): Promise<ReservationResult> {
  try {
    // Mock: replace with real API call in Phase 4
    // return fetch('/api/reservation', { method: 'POST', body: JSON.stringify(data) })
    await new Promise<void>((resolve) => setTimeout(resolve, 1500))
    console.log('[mock] Reservation submitted:', data)
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
TS
ok "services/reservation.ts scaffold created"

cat > services/menu.ts << 'TS'
/**
 * services/menu.ts
 *
 * Future: replaces MENU_ITEMS from constants.ts with a real API call.
 * Currently re-exports from constants to allow zero-touch migration path.
 *
 * Usage (drop-in replacement in MenuPage.tsx):
 *   import { getMenuItems } from '../services/menu'
 *   const items = await getMenuItems()
 */
import { MENU_ITEMS } from '../constants'
import type { MenuItem } from '../types'

export async function getMenuItems(): Promise<MenuItem[]> {
  // Mock: replace with fetch('/api/menu') in Phase 4
  return Promise.resolve(MENU_ITEMS)
}
TS
ok "services/menu.ts scaffold created"

# ─────────────────────────────────────────────────────────────
# 1e. Phase 2 Zod schema tests
# ─────────────────────────────────────────────────────────────
step "Phase 2 tests · Extending smoke.test.ts with schema tests"

cat >> tests/smoke.test.ts << 'TS'

// ─── Phase 2: Zod Schema Tests ───────────────────────────────
// Added in Phase 1 to close R-07 (incomplete test coverage).
// Tests the reservationSchema edge cases flagged in 06-code-review.md.

import { reservationSchema } from '../types'

describe('[Schema] reservationSchema — guests coerce', () => {
  it('coerces string "5" to number 5', () => {
    const result = reservationSchema.safeParse({
      name: 'Jo',
      date: new Date(Date.now() + 86400000).toISOString(),
      guests: '5',
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.guests).toBe(5)
  })

  it('rejects guests = 0', () => {
    const result = reservationSchema.safeParse({
      name: 'Jo',
      date: new Date(Date.now() + 86400000).toISOString(),
      guests: '0',
    })
    expect(result.success).toBe(false)
  })

  it('rejects guests = 11 (max 10)', () => {
    const result = reservationSchema.safeParse({
      name: 'Jo',
      date: new Date(Date.now() + 86400000).toISOString(),
      guests: '11',
    })
    expect(result.success).toBe(false)
  })
})

describe('[Schema] reservationSchema — date refine', () => {
  it('rejects past date', () => {
    const result = reservationSchema.safeParse({
      name: 'Jo',
      date: '2020-01-01T00:00',
      guests: '2',
    })
    expect(result.success).toBe(false)
  })

  it('accepts future date', () => {
    const future = new Date(Date.now() + 86400000).toISOString().slice(0, 16)
    const result = reservationSchema.safeParse({
      name: 'Jo',
      date: future,
      guests: '2',
    })
    expect(result.success).toBe(true)
  })
})

describe('[Schema] reservationSchema — name validation', () => {
  it('rejects name shorter than 2 chars', () => {
    const result = reservationSchema.safeParse({
      name: 'A',
      date: new Date(Date.now() + 86400000).toISOString(),
      guests: '2',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid name', () => {
    const result = reservationSchema.safeParse({
      name: 'Alice',
      date: new Date(Date.now() + 86400000).toISOString(),
      guests: '2',
    })
    expect(result.success).toBe(true)
  })
})
TS
ok "Schema tests appended to smoke.test.ts"

# ─────────────────────────────────────────────────────────────
# Commit Phase 1
# ─────────────────────────────────────────────────────────────
step "Committing Phase 1 changes"

do_commit ".github/ services/ tests/" "feat(infra): add CI pipeline, service layer scaffold, schema tests

Phase 1 — Stability (30 days):

ci: GitHub Actions with lint / build / test / security audit workflows
  - tsc --noEmit on every PR
  - vite build artifact upload
  - npm audit with rollup CVE check
  Refs: R-08 (score 10)

services/: Extract mock I/O from UI components
  - services/reservation.ts: submitReservation() replaces ReservationPage setTimeout
  - services/menu.ts: getMenuItems() provides future API migration path
  Both files are drop-in; UI components not yet wired (next PR)
  Refs: R-09 (score 9), 06-code-review.md P2

test: Schema edge cases for reservationSchema
  - guests coerce: string->number, boundary values 0/11
  - date refine: past date rejection, future date acceptance
  - name: min-length enforcement
  Refs: R-07 (score 12), 06-code-review.md P2"
ok "Commit handled (.github/ services/ tests/)"

echo -e "\n${BOLD}${GREEN}Phase 1 complete.${NC}"
echo ""
echo "Manual steps remaining (cannot be scripted without seeing AppContext.tsx):"
echo "  1. AppContext.tsx: replace JSON.parse with safeRead() from lib/safeStorage.ts"
echo "  2. AppContext.tsx: wrap context value in useMemo()"
echo "  3. Wire services/reservation.ts into ReservationPage.tsx"
echo "  4. Push to GitHub and confirm CI passes"
echo ""
echo "Next: bash scripts/phase2.sh"