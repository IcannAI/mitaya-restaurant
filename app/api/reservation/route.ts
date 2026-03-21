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
