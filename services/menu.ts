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
