# Mitaya's Restaurant Showcase – Modern React SPA Portfolio Project
一個單頁餐廳展示網站，完整實現動態菜單瀏覽、搜尋篩選、購物車、訂位表單、地圖展示，並強調現代前端工程最佳實務。

**Live Demo**：https://restaurant-showcase-mit.vercel.app/ （請替換成你的實際部署連結）
**技術展示重點**：React + TypeScript + 自製 component 系統 + 自製路由 + a11y + i18n + 效能意識 + 測試

## 核心功能
- **單頁應用（SPA）**：僅使用一個 `index.html`，所有內容由 JavaScript 動態渲染
- **菜單模組**：分類 Tab 切換、關鍵字搜尋、篩選（素食 / 價格區間）
- **購物車**：即時加減數量、移除項目、總額計算、localStorage 持久化
- **訂位表單**：姓名、日期、人數、備註欄位，完整驗證與錯誤提示
- **餐廳地圖**：靜態圖片 + marker + hover 資訊
- **多語言支援**：中英切換（react-i18next）
- **完整鍵盤導航**：Tab / Arrow / Enter / Esc 完整支援，無鍵盤陷阱
- **無障礙（a11y）**：ARIA 標籤、focus 可見、螢幕閱讀器友好
- **響應式設計**：mobile-first，涵蓋主流斷點
- **動畫**：購物車加入動畫、Tab 切換過渡（framer-motion）

## 技術棧
| 分類             | 技術選擇                              | 主要理由                              |
|------------------|---------------------------------------|---------------------------------------|
| 框架             | React 19 (hooks + concurrent)         | 2026 年主流，展現現代 React 思維      |
| 語言             | TypeScript 5.x                        | 強型別、可維護性、面試加分            |
| 建置工具         | Vite                                  | 極速 HMR、小 bundle                   |
| 樣式             | Tailwind CSS + shadcn/ui              | 快速開發、現代美觀、a11y 友好         |
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

## 設計決策與 Trade-off

| 決策                          | 優點                                      | 缺點 / 替代方案                     | 為什麼選擇這樣做                     |
|-------------------------------|-------------------------------------------|-------------------------------------|--------------------------------------|
| 自製路由（而非 react-router） | 展現底層理解、bundle 更小                | 缺少進階功能（nested route 等）     | 專案規模小，展示原理更重要           |
| Zustand 而非 Context/Redux    | 簡單、型別推斷好、無 boilerplate         | 不適合超大型狀態樹                  | 購物車規模適中，追求簡潔             |
| 自製 component 基類           | 強制思考生命週期與組合                   | 比純 hooks 稍冗長                   | 面試常問「你懂 React 原理嗎？」      |
| hash router 而非 history      | 部署簡單（無需 server 配置）              | URL 較不美觀                        | portfolio 優先開發/部署便利          |
| 不使用 Next.js                | 專注 client-side 能力展示                 | 失去 SSR/SSG 優勢                   | 刻意練習純 SPA 與動態渲染            |

## 如何執行專案

```bash
# 安裝依賴
npm install

# API
Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

# 開發模式
npm dev

