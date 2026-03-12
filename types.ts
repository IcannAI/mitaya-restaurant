import { z } from 'zod'

// ─── Language & Category ──────────────────────────────────────────────────────

export type Language = 'en' | 'zh-TW'

export type Category = 'popular' | 'appetizer' | 'main' | 'dessert' | 'drink'

// ─── Menu Types ───────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string
  name: { en: string; 'zh-TW': string }
  description: { en: string; 'zh-TW': string }
  price: number
  category: Category
  isVegetarian: boolean
  image: string
}

export interface CartItem extends MenuItem {
  quantity: number
}

// ─── Reservation Schema ───────────────────────────────────────────────────────
//
// guests 使用 z.coerce.number()：
//   runtime 行為：HTML <input type="number"> 回傳 string，coerce 自動轉為 number
//   型別策略：直接用 z.infer（= output type），guests = number
//             不在 useForm 傳 TFieldValues 泛型，讓 zodResolver 自動推導
//             徹底避免 Input(unknown) vs Output(number) 的 TS2322 衝突

export const reservationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),

  date: z
    .string()
    .min(1, 'Please select a date and time')
    .refine(
      (val) => new Date(val) > new Date(),
      'Reservation date must be in the future'
    ),

  guests: z.coerce
    .number()
    .int('Guest count must be a whole number')
    .min(1, 'At least 1 guest required')
    .max(10, 'Max 10 guests for online booking. For larger parties, please call us.'),

  notes: z
    .string()
    .max(200, 'Notes must be at most 200 characters')
    .optional(),
})

// z.infer = z.output：guests 為 number（coerce 轉換後的型別）
// 直接作為 useForm 的唯一型別來源，不需要分離 Input/Output type
export type ReservationFormData = z.infer<typeof reservationSchema>

// ─── Router Types ─────────────────────────────────────────────────────────────

export type RoutePath = '/' | '/menu' | '/reservation'