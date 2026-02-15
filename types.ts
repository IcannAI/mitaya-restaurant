import { z } from 'zod';

export type Language = 'en' | 'zh-TW';

export type Category = 'popular' | 'appetizer' | 'main' | 'dessert' | 'drink';

export interface MenuItem {
  id: string;
  name: { en: string; 'zh-TW': string };
  description: { en: string; 'zh-TW': string };
  price: number;
  category: Category;
  isVegetarian: boolean;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

// ========================================
// Reservation Schema & Types
// ========================================

/**
 * Reservation form validation schema
 * This is the single source of truth for form validation
 */
export const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  date: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Reservation date must be in the future",
  }),
  guests: z.coerce.number().min(1, "At least 1 guest required").max(10, "Max 10 guests for online booking"),
  notes: z.string().optional(),
});

/**
 * TypeScript type inferred from the schema
 * This ensures type and validation are always in sync
 */
export type ReservationFormData = z.infer<typeof reservationSchema>;

// Custom simple router types
export type RoutePath = '/' | '/menu' | '/reservation';