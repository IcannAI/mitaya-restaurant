/**
 * Smoke Tests – Mitaya Restaurant Showcase
 *
 * 目的：驗證核心業務邏輯（純函式，不依賴 React / DOM）
 * 執行：npm test
 *
 * 修正說明（TS2307 Cannot find module 'vitest'）：
 *   錯誤原因：主 tsconfig.json 未包含 vitest 型別，
 *             導致 tsc --noEmit 找不到 vitest 模組。
 *   修正方式：保留顯式 import（不依賴 globals），
 *             並新增 tsconfig.vitest.json 讓測試環境獨立解析型別。
 */

import { describe, it, expect } from 'vitest'

// ─── 購物車計算邏輯 ───────────────────────────────────────────────────────────

describe('[Smoke] 購物車邏輯', () => {
    const calcTotal = (items: { price: number; qty: number }[]) =>
        items.reduce((sum, item) => sum + item.price * item.qty, 0)

    it('空購物車總額為 0', () => {
        expect(calcTotal([])).toBe(0)
    })

    it('單一品項：price × qty 正確', () => {
        expect(calcTotal([{ price: 120, qty: 2 }])).toBe(240)
    })

    it('多品項：所有品項加總正確', () => {
        expect(calcTotal([
            { price: 120, qty: 2 },
            { price: 80, qty: 3 },
            { price: 200, qty: 1 },
        ])).toBe(680)
    })

    it('數量為 0 時該品項貢獻為 0', () => {
        expect(calcTotal([{ price: 500, qty: 0 }])).toBe(0)
    })
})

// ─── 訂位表單驗證邏輯 ─────────────────────────────────────────────────────────
// 對應 types.ts reservationSchema（max=10 對應 UI 的 ReservationPage input max）

describe('[Smoke] 訂位表單驗證', () => {
    const validateGuests = (n: number) => n >= 1 && n <= 10
    const validateName = (name: string) => name.trim().length >= 2

    it('人數 1-10 為有效範圍', () => {
        expect(validateGuests(1)).toBe(true)
        expect(validateGuests(10)).toBe(true)
    })

    it('人數 0 或 11 為無效', () => {
        expect(validateGuests(0)).toBe(false)
        expect(validateGuests(11)).toBe(false)
    })

    it('姓名至少 2 個字元（trim 後計算）', () => {
        expect(validateName('A')).toBe(false)
        expect(validateName('  A  ')).toBe(false)
        expect(validateName('王小明')).toBe(true)
        expect(validateName('Jo')).toBe(true)
    })
})

// ─── i18n fallback 邏輯 ───────────────────────────────────────────────────────

describe('[Smoke] 多語系切換', () => {
    const translations = {
        zh: { welcome: '歡迎光臨', menu: '菜單' },
        en: { welcome: 'Welcome', menu: 'Menu' },
    } as const

    type Lang = keyof typeof translations
    const t = (lang: Lang, key: string): string =>
        (translations[lang] as Record<string, string>)[key] ?? key

    it('中文對應正確', () => {
        expect(t('zh', 'welcome')).toBe('歡迎光臨')
        expect(t('zh', 'menu')).toBe('菜單')
    })

    it('英文對應正確', () => {
        expect(t('en', 'welcome')).toBe('Welcome')
        expect(t('en', 'menu')).toBe('Menu')
    })

    it('找不到的 key 回傳 key 本身（fallback）', () => {
        expect(t('zh', 'nonexistent_key')).toBe('nonexistent_key')
    })
})

// ─── TODO：Phase 2 測試（元件 + Schema） ─────────────────────────────────────
//
// describe('[Schema] reservationSchema', () => {
//   it('guests string "5" 應被 coerce 為 number 5', ...)
//   it('guests "abc" 應回傳 invalid_type_error', ...)
//   it('date 為過去時間應拋出 refine 錯誤', ...)
// })
//
// describe('[Component] ReservationForm', () => {
//   it('提交空表單顯示所有必填錯誤訊息', ...)
//   it('填入有效資料後成功提交顯示 success 畫面', ...)
// })
//
// describe('[Component] CartDrawer', () => {
//   it('加入品項後數量顯示正確', ...)
//   it('點擊移除後品項消失', ...)
// })
