/**
 * safeStorage.ts
 * Type-safe localStorage wrapper with Zod validation.
 *
 * Why: JSON.parse(localStorage.getItem(...)) without try-catch causes
 * White Screen of Death if data is malformed (R-03, risk score 16).
 *
 * Usage:
 *   const cart = safeRead('cart', CartItemsSchema, [])
 *   safeWrite('cart', updatedCart)
 */
import { z } from 'zod'

export function safeRead<T>(
  key: string,
  schema: z.ZodType<T>,
  fallback: T
): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const result = schema.safeParse(JSON.parse(raw))
    return result.success ? result.data : fallback
  } catch {
    return fallback
  }
}

export function safeWrite<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage quota exceeded or private browsing — fail silently
  }
}

export function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // Fail silently
  }
}
