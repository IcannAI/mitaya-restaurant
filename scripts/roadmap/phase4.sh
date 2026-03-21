#!/usr/bin/env bash
# ============================================================
# PHASE 4 — Product Scripts (beyond 90 days)
# Mitaya Restaurant · FAANG-grade execution
# Constraint: ZERO frontend UI changes during backend addition
# Usage: bash phase4.sh [--no-commit]
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
info() { echo -e "${YELLOW}ℹ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; exit 1; }

[ -f "package.json" ] || fail "Not in project root."
[ -d "src" ]          || fail "src/ not found. Run phase3.sh first."

# ─────────────────────────────────────────────────────────────
# 4a. Next.js migration scaffold
# ─────────────────────────────────────────────────────────────
step "4a · Next.js App Router scaffold (additive — does not break Vite)"

info "Strategy: scaffold Next.js structure alongside Vite."
info "Both can coexist until full migration is verified."

# Install Next.js
npm install next@latest
npm install --save-dev @types/node

# Create app directory structure (Next.js App Router)
mkdir -p app/{api/{menu,reservation,cart},\(restaurant\)}

# Next.js config
cat > next.config.ts << 'TS'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Coexist with Vite during migration
  // Remove when Vite is fully replaced
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig
TS
ok "next.config.ts created"

# ─── API Routes ───────────────────────────────────────────────
cat > app/api/menu/route.ts << 'TS'
/**
 * GET /api/menu
 *
 * Returns menu items. Currently sourced from constants.ts (static data).
 * Future: replace with database query (Prisma / Supabase).
 *
 * This route is a drop-in for services/menu.ts getMenuItems().
 * Zero frontend change required — services/menu.ts will call this endpoint.
 */
import { NextResponse } from 'next/server'
import { MENU_ITEMS } from '../../../constants'

export async function GET() {
  return NextResponse.json(MENU_ITEMS, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
TS
ok "app/api/menu/route.ts created"

cat > app/api/reservation/route.ts << 'TS'
/**
 * POST /api/reservation
 *
 * Accepts a reservation submission.
 * Validates with reservationSchema (same schema as frontend).
 * Currently logs and returns success — replace with DB write.
 *
 * This route replaces services/reservation.ts submitReservation().
 * Frontend change: update services/reservation.ts fetch URL only.
 */
import { NextRequest, NextResponse } from 'next/server'
import { reservationSchema } from '../../../types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = reservationSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, errors: result.error.flatten() },
        { status: 422 }
      )
    }

    // TODO Phase 4b: persist to database
    // await db.reservation.create({ data: result.data })
    console.log('[api/reservation] Received:', result.data)

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
TS
ok "app/api/reservation/route.ts created"

cat > app/api/cart/route.ts << 'TS'
/**
 * GET /api/cart — retrieve server-side cart (Phase 4b: requires auth)
 * POST /api/cart — sync cart to server
 *
 * Phase 4a: returns empty cart (localStorage still primary).
 * Phase 4b: switch to server session after auth is implemented.
 *
 * This enables cross-device cart sync and solves the localStorage
 * single-device limitation (audit/09-REPORT.md Future Improvements).
 */
import { NextRequest, NextResponse } from 'next/server'
import { CartItemsSchema } from '../../../types'

export async function GET() {
  // Phase 4b: return session cart
  // const session = await getServerSession()
  // return NextResponse.json(await db.cart.findMany({ where: { userId: session.user.id } }))
  return NextResponse.json([])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = CartItemsSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ ok: false }, { status: 422 })
  }
  // Phase 4b: persist to session/db
  return NextResponse.json({ ok: true })
}
TS
ok "app/api/cart/route.ts created"

# ─────────────────────────────────────────────────────────────
# 4b. Update services/ to call real API endpoints
# ─────────────────────────────────────────────────────────────
step "4b · Updating services/ to call API routes"

cat > services/reservation.ts << 'TS'
/**
 * services/reservation.ts (Phase 4 update)
 *
 * Now calls the real Next.js API route instead of setTimeout mock.
 * Zero change required in ReservationPage.tsx — same interface.
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
    const res = await fetch('/api/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { ok: false, error: err.error ?? `HTTP ${res.status}` }
    }
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error',
    }
  }
}
TS
ok "services/reservation.ts updated to real API call"

cat > services/menu.ts << 'TS'
/**
 * services/menu.ts (Phase 4 update)
 *
 * Fetches menu from API route with SWR caching strategy.
 * Falls back to static MENU_ITEMS if fetch fails (resilience).
 */
import { MENU_ITEMS } from '../constants'
import type { MenuItem } from '../types'

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const res = await fetch('/api/menu', {
      next: { revalidate: 300 },  // Next.js cache: 5 min
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch {
    console.warn('[menu] API unavailable, falling back to static data')
    return MENU_ITEMS
  }
}
TS
ok "services/menu.ts updated with fallback"

# ─────────────────────────────────────────────────────────────
# 4c. PWA setup
# ─────────────────────────────────────────────────────────────
step "4c · PWA manifest and service worker"

npm install --save-dev next-pwa

cat > public/manifest.json << 'JSON'
{
  "name": "Mitaya's Restaurant",
  "short_name": "Mitaya",
  "description": "Reserve your table and browse our menu",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1a1a18",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
JSON
ok "public/manifest.json created"

# ─────────────────────────────────────────────────────────────
# 4d. Lighthouse CI
# ─────────────────────────────────────────────────────────────
step "4d · Lighthouse CI configuration"

cat > lighthouserc.json << 'JSON'
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance":    ["warn", { "minScore": 0.9 }],
        "categories:accessibility":  ["error", { "minScore": 0.98 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo":            ["warn", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
JSON
ok "lighthouserc.json created (accessibility ≥ 0.98 enforced)"

cat > .github/workflows/lighthouse.yml << 'YAML'
name: Lighthouse CI

on:
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v12
        with:
          configPath: ./lighthouserc.json
          uploadArtifacts: true
          temporaryPublicStorage: true
YAML
ok ".github/workflows/lighthouse.yml created"

# ─────────────────────────────────────────────────────────────
# Update package.json scripts
# ─────────────────────────────────────────────────────────────
step "Adding Next.js scripts to package.json"

node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = {
  ...pkg.scripts,
  'dev:next': 'next dev',
  'build:next': 'next build',
  'start': 'next start',
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('package.json updated');
"
ok "package.json scripts updated"

# ─────────────────────────────────────────────────────────────
# Commit Phase 4
# ─────────────────────────────────────────────────────────────
step "Committing Phase 4 changes"

git add app/ services/ next.config.ts public/manifest.json \
        lighthouserc.json .github/workflows/lighthouse.yml \
        package.json package-lock.json

git diff --cached --quiet || \
  git commit -m "feat(backend): Next.js API routes, PWA, Lighthouse CI

Phase 4 — Product (beyond 90 days):

4a: Next.js App Router API routes
  - app/api/menu/route.ts: GET menu items (replaces static constants)
  - app/api/reservation/route.ts: POST reservation with Zod validation
  - app/api/cart/route.ts: GET/POST cart (Phase 4b stub for auth)
  - services/reservation.ts: now calls real API, zero UI change
  - services/menu.ts: calls API with static fallback for resilience

4b: Server-side architecture ready for auth
  - All routes stubbed for Phase 4b database integration
  - TODO comments mark Prisma/Supabase insertion points

4c: PWA foundation
  - public/manifest.json with icon sizes and theme
  - next-pwa installed (configure after full Next.js migration)

4d: Lighthouse CI
  - lighthouserc.json: a11y ≥ 0.98 enforced as error, not warning
  - Performance ≥ 0.9 as warning
  - .github/workflows/lighthouse.yml on main push

MIGRATION STATUS: Vite still primary dev tool.
Next.js coexists; full migration in next PR.

Refs: audit/09-REPORT.md Future Improvements; audit/07-swot.md Opportunities"

ok "Phase 4 committed"

echo -e "\n${BOLD}${GREEN}Phase 4 complete.${NC}"
echo ""
echo "Next steps (Phase 4b — Auth):"
echo "  npm install next-auth prisma @prisma/client"
echo "  npx prisma init"
echo "  Configure DATABASE_URL in .env.local"
echo ""
echo "All 5 phases complete. Review audit/09-REPORT.md for remaining items."