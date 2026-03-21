/**
 * features/cart — public API
 *
 * External modules import ONLY from this file.
 * Internal structure can change without affecting consumers.
 */
export { useCartStore } from './model/cart.store'
export type { CartItem } from './model/types'
export { CartSummary } from './ui/CartSummary'
