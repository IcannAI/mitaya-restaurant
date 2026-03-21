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
