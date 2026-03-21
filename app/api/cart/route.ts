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
