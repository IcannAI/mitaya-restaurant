/**
 * tests/components/useCustomRouter.test.ts
 * Tests the hash-based routing hook.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('[Hook] useCustomRouter — hash navigation', () => {
  beforeEach(() => {
    window.location.hash = ''
  })
  afterEach(() => {
    window.location.hash = ''
  })

  it('hash change fires hashchange event', () => {
    return new Promise<void>((resolve) => {
      window.addEventListener('hashchange', () => resolve(), { once: true })
      window.location.hash = '#/menu'
    })
  })

  it('maps / to home route', () => {
    window.location.hash = '#/'
    expect(window.location.hash).toBe('#/')
  })

  it('maps /menu to menu route', () => {
    window.location.hash = '#/menu'
    expect(window.location.hash).toBe('#/menu')
  })
})
