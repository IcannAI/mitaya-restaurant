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
