# Mitaya Restaurant — Execution Scripts

FAANG-grade automation scripts for the 5-phase roadmap.
All scripts enforce: **ZERO frontend UI changes**.

## Prerequisites

```bash
cd ~/Desktop/MVP/mitaya-restaurant
node --version   # must be >= 20
git status       # should be clean before each phase
```

## Execution order

```bash
bash scripts/roadmap/phase0.sh   # Emergency (run NOW — before any feature work)
bash scripts/roadmap/phase1.sh   # Stability — 30 days
bash scripts/roadmap/phase2.sh   # Refactor  — 60 days
bash scripts/roadmap/phase3.sh   # Scaling   — 90 days
bash scripts/roadmap/phase4.sh   # Product   — beyond 90 days
```

## --no-commit flag

Every script supports `--no-commit`. Use it when you want to:
- **Inspect** the generated files before deciding to commit
- **Stage selectively** (commit only part of the output)
- **Run in CI** without side effects
- **Review diffs** with `git diff` before committing

```bash
# Default: creates files AND commits automatically
bash scripts/roadmap/phase0.sh

# With --no-commit: creates files only, prints git instructions
bash scripts/roadmap/phase0.sh --no-commit
```

When `--no-commit` is set, the script prints the exact commands
to run manually instead of executing them:

```
── Skipped commit (--no-commit). Run manually when ready: ──
  git add docs/ lib/
  git commit -m 'docs(adr): materialize docs/adr/ directory with 3 initial ADRs'
```

## What each script does

| Script | Risk | UI impact | Commits | Effort |
|--------|------|-----------|---------|--------|
| phase0 | CRITICAL fixes | None | 2 | 3h |
| phase1 | Infra + tests | None | 1 | 1 day |
| phase2 | Dependencies + stores | None | 1 | 2 days |
| phase3 | Architecture + hooks | None (opt-in) | 1 | 3 days |
| phase4 | Backend + PWA | None | 1 | 1 week |

## Relation to audit/ scripts

```
scripts/
  audit/        ← READ-ONLY: analyse & report, no file changes
    phase1_structure.sh
    phase2_docs.sh
    ...
  roadmap/      ← WRITES FILES & COMMITS (use --no-commit to inspect first)
    phase0.sh
    phase1.sh
    ...
    README.md   ← this file
```

The `audit/` and `roadmap/` scripts share phase numbering but serve
completely different purposes. The naming convention is:
- `audit/phaseN_*.sh` — produces reports
- `roadmap/phaseN.sh` — modifies the codebase

## Manual steps (cannot be scripted)

Each script prints the manual steps it cannot automate safely.

### Phase 0 manual
- `AppContext.tsx`: replace `JSON.parse(localStorage...)` with `safeRead()`

### Phase 1 manual
- `AppContext.tsx`: wrap context value and cartTotal in `useMemo()`
- `ReservationPage.tsx`: import `submitReservation` from `services/reservation`

### Phase 2 manual
- `index.tsx`: add `import './lib/i18n'` before app render
- All `.tsx` components: migrate `useApp()` → `useCartStore()` / `useLanguageStore()`
- `index.html`: remove Tailwind CDN `<script>`, add `<link>` for `index.css`

### Phase 3 manual
- `MenuPage.tsx`: wire `useMenuFilter` hook
- `App.tsx`: add Suspense boundary with `lazyPages`

### Phase 4 manual
- Configure `DATABASE_URL` in `.env.local`
- Full Next.js migration (Vite coexists until this step)