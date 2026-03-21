/**
 * store/cart.store.ts
 *
 * Replaces AppContext cart state with a Zustand store.
 * - Fine-grained selectors prevent unnecessary re-renders
 * - Persisted to localStorage via safeStorage utility (R-03)
 * - Aggregate Root pattern: all cart mutations go through this store
 *
 * Migration from AppContext:
 *   BEFORE: const { cart, addToCart } = useApp()
 *   AFTER:  const cart = useCartStore(s => s.items)
 *           const addToCart = useCartStore(s => s.addItem)
 */
import { create } from 'zustand'
import { safeRead, safeWrite } from '../lib/safeStorage'
import { CartItemsSchema } from '../types'
import type { CartItem } from '../types'

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  // Derived values (computed, not stored)
  total: number
  itemCount: number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: safeRead('mitaya-cart', CartItemsSchema, []),
  total: 0,
  itemCount: 0,

  addItem: (menuItem) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === menuItem.id)
      const updated = existing
        ? state.items.map((i) =>
            i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { ...menuItem, quantity: 1 }]
      safeWrite('mitaya-cart', updated)
      return {
        items: updated,
        total: updated.reduce((sum, i) => sum + i.price * i.quantity, 0),
        itemCount: updated.reduce((sum, i) => sum + i.quantity, 0),
      }
    }),

  removeItem: (id) =>
    set((state) => {
      const updated = state.items.filter((i) => i.id !== id)
      safeWrite('mitaya-cart', updated)
      return {
        items: updated,
        total: updated.reduce((sum, i) => sum + i.price * i.quantity, 0),
        itemCount: updated.reduce((sum, i) => sum + i.quantity, 0),
      }
    }),

  updateQty: (id, qty) =>
    set((state) => {
      const updated =
        qty <= 0
          ? state.items.filter((i) => i.id !== id)
          : state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
      safeWrite('mitaya-cart', updated)
      return {
        items: updated,
        total: updated.reduce((sum, i) => sum + i.price * i.quantity, 0),
        itemCount: updated.reduce((sum, i) => sum + i.quantity, 0),
      }
    }),

  clearCart: () => {
    safeWrite('mitaya-cart', [])
    set({ items: [], total: 0, itemCount: 0 })
  },
}))
