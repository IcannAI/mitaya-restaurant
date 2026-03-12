# Contributing to Mitaya's Restaurant Showcase

以下說明如何設定開發環境、提交貢獻，以及本專案的規範。

---

## 開發環境設定

### 系統需求

| 工具 | 版本需求 |
|------|---------|
| Node.js | >= 20.x（建議使用 LTS） |
| npm | >= 10.x |
| Git | 任意現代版本 |

### 快速開始

```bash
# 1. Fork 並 clone 專案
git clone https://github.com/<your-username>/mitaya-restaurant.git
cd mitaya-restaurant

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
# → 開啟 http://localhost:5173

# 4. 執行型別檢查
npm run lint

# 5. 執行測試
npm test
```

### 專案結構說明

```
mitaya-restaurant/
├── components/          # 共用 UI 元件
│   └── ui/              # 基礎元件（Button, Input 等）
├── context/             # AppContext（狀態管理）
├── hooks/               # 自製 hooks（useCustomRouter 等）
├── pages/               # 頁面元件（HomePage, MenuPage, ReservationPage）
├── constants.ts         # 靜態資料與常數
├── types.ts             # TypeScript 型別定義
└── App.tsx              # 應用程式入口
```

> **注意**：目前所有 source 資料夾位於根目錄而非 `src/`，此為已知架構問題，計畫後續整理。

---

## 提交流程

### 1. 建立 Branch

```bash
# 功能開發
git checkout -b feat/your-feature-name

# 問題修復
git checkout -b fix/issue-description

# 文件更新
git checkout -b docs/what-you-updated
```

### 2. Commit 規範

本專案遵循 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <簡短描述>

[可選 body：詳細說明]

[可選 footer：關聯 issue，如 Closes #12]
```

**Type 對照表：**

| Type | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修復 bug |
| `docs` | 文件變更 |
| `style` | 格式調整（不影響邏輯） |
| `refactor` | 重構（非新功能、非修 bug） |
| `test` | 新增或修改測試 |
| `chore` | 建置工具、依賴更新 |
| `security` | 安全性修補 |

**範例：**

```bash
# ✅ 好的 commit
feat(cart): add quantity increment with keyboard support
fix(form): correct date validation for past dates
docs(readme): sync tech stack with actual implementation
chore(deps): upgrade vite to 6.5.0 to patch rollup CVE

# ❌ 避免的 commit
Addimprovements
fix
Update README.md
```

### 3. 開 Pull Request

- 標題遵循 Conventional Commits 格式
- 說明你改了什麼、為什麼這樣改
- 如有視覺變更，附上截圖
- 確認 `npm run lint` 與 `npm test` 皆通過

---

## 測試規範

```bash
# 執行所有測試
npm test

# 監聽模式（開發時使用）
npm test -- --watch

# 產生覆蓋率報告
npm run test:coverage
```

### 測試重點區域

優先為以下邏輯撰寫測試：

- 表單驗證（必填欄位、日期格式、人數範圍）
- 購物車操作（加入、增減數量、移除、總額計算）
- 語言切換（i18n 文字對應正確）
- 路由導覽（hash 變更觸發正確頁面）

---

## 已知限制

| 項目 | 現況 | 說明 |
|------|------|------|
| 測試 | 初期建立中 | 歡迎貢獻測試案例 |
| CI/CD | 尚未建立 | PR 需手動執行 lint 與 test |
| 路由 | 自製 hash router | 暫不接受遷移至 react-router-dom 的 PR，待架構討論後決定 |
| 狀態管理 | React Context | Zustand 遷移列入 Roadmap，歡迎討論方案 |

---

## 回報Issue

回報 bug 時請包含：

1. 瀏覽器與版本
2. 重現步驟（Step-by-step）
3. 預期行為 vs 實際行為
4. 相關截圖或 console 錯誤

---

## 行為準則

請保持尊重，歡迎任何程度的貢獻者參與。

---

*如有任何問題，歡迎開 Issue 討論。*
