/**
 * hooks/usePageLoader.ts
 *
 * Provides lazy-loaded page components with Suspense boundaries.
 * Used in App.tsx to enable code splitting per route.
 *
 * FAANG signal: demonstrates React.lazy + Suspense for performance.
 * Reduces initial bundle by deferring non-active page code.
 *
 * Usage in App.tsx:
 *   import { lazyPages } from '../hooks/usePageLoader'
 *   <Suspense fallback={<PageSkeleton />}>
 *     <lazyPages.Menu />
 *   </Suspense>
 */
import { lazy } from 'react'

export const lazyPages = {
  Home:        lazy(() => import('../pages/HomePage').then(m => ({ default: m.HomePage }))),
  Menu:        lazy(() => import('../pages/MenuPage').then(m => ({ default: m.MenuPage }))),
  Reservation: lazy(() => import('../pages/ReservationPage').then(m => ({ default: m.ReservationPage }))),
}
