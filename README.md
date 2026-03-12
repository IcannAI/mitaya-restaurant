# Mitaya's Restaurant Showcase – Modern React SPA Portfolio Project

一個單頁餐廳展示網站，完整實現動態菜單瀏覽、搜尋篩選、購物車、訂位表單、地圖展示。

**技術展示重點**：React 19 + TypeScript + Functional Components + 自製路由 + a11y + 自製 i18n + 效能意識

---

## Known Issues

> ⚠️ 以下為已知待修問題，歡迎貢獻修復。

- [ ] **[Security]** `rollup` CVE [GHSA-mw96-cpmx-2vgc](https://github.com/advisories/GHSA-mw96-cpmx-2vgc)（高嚴重性：任意檔案寫入）
  - Fix：升級 `vite` 至 `>=6.5.0`
- [ ] **[Cleanup]** 未使用依賴：`react-router-dom`、`react-markdown`
  - Fix：`npm uninstall react-router-dom react-markdown`
- [ ] **[Compliance]** 缺少根目錄 `LICENSE` 檔案（package.json 宣告 ISC 但檔案不存在）

---

## Functionality

- **單頁應用（SPA）**：僅使用一個 `index.html`，所有內容由 JavaScript 動態渲染
- **菜單模組**：分類 Tab 切換、關鍵字搜尋、篩選（素食 / 價格區間）
- **購物車**：即時加減數量、移除項目、總額計算、localStorage 持久化
- **訂位表單**：姓名、日期、人數、備註欄位，完整驗證與錯誤提示
- **餐廳地圖**：靜態圖片 + marker + hover 資訊
- **多語言支援**：中英切換（自製實作；計畫遷移至 react-i18next）
- **完整鍵盤導航**：Tab / Arrow / Enter / Esc 完整支援，無鍵盤陷阱
- **無障礙（a11y）**：ARIA 標籤、focus 可見、螢幕閱讀器友好
- **響應式設計**：mobile-first，涵蓋主流斷點
- **動畫**：購物車加入動畫、Tab 切換過渡（framer-motion）

---

## Tech Stack

### 現況 vs 計畫對照

| 層面 | 現況實作 | 計畫目標 |
|------|---------|---------|
| 狀態管理 | React Context（AppContext） | Zustand |
| 多語系 | 自製中英切換 | react-i18next |
| 路由 | 自製 `useCustomRouter`（hash-based） | 評估遷移至 react-router-dom |
| 元件庫 | 手動實作 Button / Input | 完整 shadcn/ui |
| 測試 | 尚未建立 | Vitest + @testing-library/react |
| CI/CD | 無 | GitHub Actions（lint / build / 安全掃描） |

### 完整技術清單

| 分類 | 技術 | 備註 |
|------|------|------|
| 框架 | React 19 (Concurrent) | Functional Components + Hooks |
| 語言 | TypeScript 5.8 | 強型別、可維護性 |
| 建置工具 | Vite 6 | 極速 HMR、小 bundle |
| 樣式 | Tailwind CSS + clsx + tailwind-merge | 工具類管理 |
| 元件 | 手動實作 Button.tsx / Input.tsx | 參考 shadcn/ui 設計規範 |
| 路由 | 自製 `useCustomRouter`（hash-based） | 展現對瀏覽器路由機制的理解 |
| 狀態管理 | React Context（AppContext） | 管理語言 / 購物車 / UI 狀態 |
| 表單 | react-hook-form + zod | 高效驗證、型別安全 |
| 動畫 | framer-motion | 宣告式、好控制 |
| i18n | 自製實作 | 中英切換；計畫遷移至 react-i18next |
| 測試 | 尚未建立 | 計畫引入 Vitest（見 Roadmap） |
| 圖示 | lucide-react | 輕量 SVG 圖示庫 |

---

## Accessibility Strategy

1. **語意化 HTML**
   - 使用正確的 landmark roles（`<main>`, `<nav>`, `<section>`, `<article>` 等）
   - 菜單項目使用 `<ul role="tablist">` + `<li role="tab">` + `aria-selected` + `aria-controls`

2. **鍵盤導航完整性**
   - 所有互動元件（Tab、Button、輸入框、購物車項目）皆可透過 Tab 鍵依邏輯順序到達
   - Tab 切換使用 Arrow 左右鍵移動焦點，Enter / Space 啟動
   - Esc 可關閉 modal、購物車抽屜或下拉選單
   - 避免鍵盤陷阱（focus trap 在必要 modal 內實現）

3. **螢幕閱讀器支援**
   - 動態內容變化使用 `aria-live="polite"`（購物車總額更新、搜尋結果數量）
   - 表單錯誤訊息使用 `aria-describedby` 關聯錯誤文字
   - 圖示按鈕提供 `aria-label` 或 `aria-labelledby`
   - 地圖使用 `role="img"` + `aria-label` 描述位置

4. **視覺與顏色對比**
   - 文字對比至少 4.5:1（正常文字）/ 3:1（大型文字）
   - focus 狀態使用明顯輪廓（outline + 2px offset），不只靠顏色變化
   - 支援高對比模式（Tailwind dark mode 基礎上強化）

5. **驗證工具**
   - axe DevTools / WAVE / Lighthouse Accessibility 分數目標 ≥ 98
   - 手動鍵盤測試（Windows Narrator + NVDA + VoiceOver）

---

## Roadmap

### 短期（已排定）

- [ ] 修補 rollup CVE：升級 `vite` 至 `>=6.5.0`
- [ ] 移除未使用依賴：`react-router-dom`、`react-markdown`
- [ ] 新增根目錄 `LICENSE` 檔案（ISC）
- [ ] 新增 `CONTRIBUTING.md`（開發環境設定、commit 規範）
- [ ] 建立 Vitest 測試基礎架構 + 第一個 smoke test

### 中期（技術債清償）

- [ ] 狀態管理遷移：React Context → Zustand
- [ ] i18n 遷移：自製實作 → react-i18next
- [ ] 建立 GitHub Actions CI/CD（lint / build / 安全掃描）
- [ ] 擴充測試覆蓋：表單驗證、購物車邏輯、Tab 切換

### 長期（功能擴充）

- [ ] 串接真實後端 API（菜單資料、訂位提交）
- [ ] 使用者認證系統（訂位歷史、常用購物車）
- [ ] 轉換為 Next.js App Router + Server Components
- [ ] 實作 PWA（離線瀏覽、推送通知）
- [ ] 支援更多語言（日文、韓文）與 RTL 語言佈局
- [ ] 視覺回歸測試 + Lighthouse CI
- [ ] 無障礙自動化測試（cypress-axe 或 playwright-axe）

---

## Contributing

請參閱 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解開發環境設定與貢獻規範。

---

## License

ISC © [IcannAI](https://github.com/IcannAI)
