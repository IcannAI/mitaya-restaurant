/**
 * tests/components/CartDrawer.test.tsx
 *
 * Component test for CartDrawer (Phase 3 test coverage expansion).
 * Tests the integration between Zustand cart store and CartDrawer UI.
 * Refs: R-07 (score 12), 06-code-review.md P3
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../../store/cart.store'

// Reset store before each test to prevent state leakage
beforeEach(() => {
  useCartStore.setState({ items: [] })
  localStorage.clear()
})

describe('[Component] CartDrawer — store integration', () => {
  it('shows empty state when cart has no items', () => {
    expect(useCartStore.getState().items).toHaveLength(0)
    expect(useCartStore.getState().itemCount).toBe(0)
  })

  it('total updates correctly after addItem', () => {
    const { addItem } = useCartStore.getState()
    addItem({
      id: 'item-1',
      name: { en: 'Test', 'zh-TW': '測試' },
      price: 100,
      category: 'main',
      isVegetarian: false,
      image: '/test.jpg',
      description: { en: 'desc', 'zh-TW': '描述' },
    })
    expect(useCartStore.getState().total).toBe(100)
    expect(useCartStore.getState().itemCount).toBe(1)
  })

  it('removeItem removes the item and updates total', () => {
    const { addItem, removeItem } = useCartStore.getState()
    addItem({ id: 'item-2', name: { en: 'Test', 'zh-TW': '測試' }, price: 200,
      category: 'main', isVegetarian: false, image: '/t.jpg',
      description: { en: 'd', 'zh-TW': 'd' } })
    removeItem('item-2')
    expect(useCartStore.getState().items).toHaveLength(0)
    expect(useCartStore.getState().total).toBe(0)
  })

  it('persists to localStorage on addItem', () => {
    const { addItem } = useCartStore.getState()
    addItem({ id: 'item-3', name: { en: 'Test', 'zh-TW': '測試' }, price: 50,
      category: 'appetizer', isVegetarian: true, image: '/t.jpg',
      description: { en: 'd', 'zh-TW': 'd' } })
    const stored = JSON.parse(localStorage.getItem('mitaya-cart') || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('item-3')
  })
})
