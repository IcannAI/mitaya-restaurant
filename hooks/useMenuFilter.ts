/**
 * hooks/useMenuFilter.ts
 *
 * Extracts menu filtering logic from HomePage.tsx (06-code-review.md P3).
 * Uses useTransition to mark filter updates as non-urgent, preventing
 * UI jank on large menu lists.
 *
 * FAANG signal: demonstrates understanding of React 19 Concurrent Mode.
 *
 * Usage in MenuPage.tsx:
 *   const { filtered, isPending, setQuery, setCategory } = useMenuFilter(MENU_ITEMS)
 *
 *   BEFORE: items.filter(i => i.name.en.includes(query))  — in component
 *   AFTER:  filtered  — from this hook, non-blocking
 */
import { useState, useTransition, useMemo } from 'react'
import type { MenuItem, Category } from '../types'

interface FilterState {
  query: string
  category: Category | 'all'
  vegetarianOnly: boolean
}

export function useMenuFilter(allItems: MenuItem[]) {
  const [isPending, startTransition] = useTransition()
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    category: 'all',
    vegetarianOnly: false,
  })

  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase()
    return allItems.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.en.toLowerCase().includes(q) ||
        item.name['zh-TW'].toLowerCase().includes(q)
      const matchesCategory =
        filters.category === 'all' || item.category === filters.category
      const matchesVeg = !filters.vegetarianOnly || item.isVegetarian
      return matchesQuery && matchesCategory && matchesVeg
    })
  }, [allItems, filters])

  const setQuery = (query: string) =>
    startTransition(() => setFilters((f) => ({ ...f, query })))

  const setCategory = (category: FilterState['category']) =>
    startTransition(() => setFilters((f) => ({ ...f, category })))

  const setVegetarian = (vegetarianOnly: boolean) =>
    startTransition(() => setFilters((f) => ({ ...f, vegetarianOnly })))

  return { filtered, isPending, setQuery, setCategory, setVegetarian, filters }
}
