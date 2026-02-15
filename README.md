# Mitaya's Restaurant Showcase – Modern React SPA Portfolio Project
一個單頁餐廳展示網站，完整實現動態菜單瀏覽、搜尋篩選、購物車、訂位表單、地圖展示，並強調現代前端工程最佳實務。

**技術展示重點**：React + TypeScript + 自製 component 系統 + 自製路由 + a11y + i18n + 效能意識 + 測試

## Functionality

- **單頁應用（SPA）**：僅使用一個index.html，所有內容由 JavaScript 動態渲染
- **菜單模組**：分類 Tab 切換、關鍵字搜尋、篩選（素食 / 價格區間）
- **購物車**：即時加減數量、移除項目、總額計算、localStorage 持久化
- **訂位表單**：姓名、日期、人數、備註欄位，完整驗證與錯誤提示
- **餐廳地圖**：靜態圖片 + marker + hover 資訊
- **多語言支援**：中英切換（react-i18next）
- **完整鍵盤導航**：Tab / Arrow / Enter / Esc 完整支援，無鍵盤陷阱
- **無障礙（a11y）**：ARIA 標籤、focus 可見、螢幕閱讀器友好
- **響應式設計**：mobile-first，涵蓋主流斷點
- **動畫**：購物車加入動畫、Tab 切換過渡（framer-motion）

## Technology Stack
| 分類             | 技術選擇                              | 主要理由                              |
|------------------|---------------------------------------|---------------------------------------|
| 框架             | React 19 (hooks + concurrent)         | 主流，展現現代 React 思維      |
| 語言             | TypeScript 5.x                        | 強型別、可維護性、面試加分            |
| 建置工具         | Vite                                  | 極速 HMR、小 bundle                   |
| 樣式             | Tailwind CSS + shadcn/ui              | 快速開發、現代美觀、a11y          |
| 路由             | 自製 hash-based router                | 展現對瀏覽器路由機制的理解            |
| 狀態管理         | Zustand                               | 輕量、型別安全、易測試                |
| 表單             | react-hook-form + zod                 | 高效、效能佳、驗證強大                |
| 動畫             | framer-motion                         | 宣告式、好控制                        |
| i18n             | react-i18next                         | 支援複數、格式化                      |
| 測試             | Vitest + @testing-library/react       | 現代、聚焦行為測試                    |
| Component 系統   | 自製基類（render / mount / unmount）  | 展現對元件生命週期與組合的理解        |


- **測試覆蓋**  
  至少涵蓋：
  - 表單驗證（必填、日期格式、人數範圍）
  - Tab 切換與內容渲染
  - 購物車加/減/移除邏輯
  - 錯誤邊界處理

  覆蓋率約 75–85%（業務邏輯部分）

## Accessibility Strategy

1. **語意化 HTML**  
   - 使用正確的 landmark roles（`<main>`, `<nav>`, `<section>`, `<article>` 等）  
   - 菜單項目使用 `<ul role="tablist">` + `<li role="tab">` + `aria-selected` + `aria-controls`

2. **鍵盤導航完整性**  
   - 所有互動元件（Tab、Button、輸入框、購物車項目）皆可透過 Tab 鍵依邏輯順序到達  
   - Tab 切換使用 Arrow 左右鍵移動焦點，Enter/Space 啟動  
   - Esc 可關閉 modal、購物車抽屜或下拉選單  
   - 避免鍵盤陷阱（focus trap 在必要 modal 內實現）

3. **螢幕閱讀器支援**  
   - 動態內容變化使用 `aria-live="polite"`（購物車總額更新、搜尋結果數量）  
   - 表單錯誤訊息使用 `aria-describedby` 關聯錯誤文字  
   - 圖示按鈕提供 `aria-label` 或 `aria-labelledby`  
   - 地圖使用 `role="img"` + `aria-label` 描述位置

4. **視覺與顏色對比**  
   - 文字對比至少 4.5:1（正常文字） / 3:1（大型文字）  
   - focus 狀態使用明顯輪廓（outline + 2px offset），不只靠顏色變化  
   - 支援高對比模式（Tailwind dark mode 基礎上再強化）

5. **測試與驗證工具**  
   - axe DevTools / WAVE / Lighthouse Accessibility 分數 ≥98  
   - 手動鍵盤測試（Windows Narrator + NVDA + VoiceOver）  
   - 螢幕閱讀器讀取購物車總額、表單錯誤、搜尋結果數量正確


## Future Improvements

- 串接真實後端 API（菜單資料、訂位提交、訂單狀態查詢）
- 加入使用者認證系統（登入後保存訂位歷史與常用購物車）
- 轉換為 Next.js App Router + Server Components + React Server Actions
- 實作 PWA（離線瀏覽菜單、安裝提示、推送通知）
- 優化圖片載入：使用 `<img loading="lazy">` + placeholder blur + WebP/AVIF 格式
- 支援更多語言（日文、韓文）與 RTL 語言佈局
- 加入菜單推薦引擎（根據偏好 / 過去訂單）
- 完整 CI/CD 流程（GitHub Actions + 視覺回歸測試 + Lighthouse CI）
- 實作無障礙自動化測試（cypress-axe 或 playwright-axe）
- 支援深色模式切換記憶（localStorage + prefers-color-scheme）
- 購物車進階功能：優惠碼、稅金計算、送貨選項