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
