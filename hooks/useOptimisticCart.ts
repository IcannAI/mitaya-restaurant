/**
 * hooks/useOptimisticCart.ts
 *
 * Wraps useCartStore with React 19 useOptimistic for instant UI feedback
 * when adding items (before any async confirmation).
 *
 * FAANG signal: demonstrates useOptimistic API, a React 19 feature.
 * Interview talking point: "optimistic updates reduce perceived latency
 * from ~1500ms mock to 0ms, matching the mental model of adding to cart."
 *
 * Usage in MenuPage.tsx:
 *   const { optimisticItems, addOptimistic } = useOptimisticCart()
 *   onClick={() => addOptimistic(menuItem)}
 */
import { useOptimistic } from 'react'
import { useCartStore } from '../store'
import type { CartItem } from '../types'

export function useOptimisticCart() {
  const { items, addItem } = useCartStore((s) => ({
    items: s.items,
    addItem: s.addItem,
  }))

  const [optimisticItems, addOptimistic] = useOptimistic(
    items,
    (state: CartItem[], newItem: Omit<CartItem, 'quantity'>) => {
      const existing = state.find((i) => i.id === newItem.id)
      return existing
        ? state.map((i) =>
            i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state, { ...newItem, quantity: 1 }]
    }
  )

  const addWithOptimistic = (item: Omit<CartItem, 'quantity'>) => {
    addOptimistic(item)   // instant UI update
    addItem(item)         // real store update
  }

  return { optimisticItems, addWithOptimistic }
}
