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
