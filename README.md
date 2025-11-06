# GitHub Repo Explorer

一個純前端的 SPA 應用程式，使用 GitHub Personal Access Token 來瀏覽 GitHub 儲存庫的檔案列表。

## ⚠️ 重要說明

本專案採用 **Personal Access Token** 方式登入 GitHub 帳號。

## 📁 專案架構

```
./
├── css/
│   └── styles.css          # 所有樣式檔案
├── js/
│   ├── app.js              # 主應用程式入口
│   ├── auth.js             # 認證模組（OAuth Device Flow）
│   ├── repo.js             # Repository 操作模組
│   └── ui.js               # UI 管理模組
├── config.js               # 設定檔（Client ID, scopes）
└── index.html              # 主 HTML 檔案
```

## 🏗️ 模組說明

### `js/auth.js` - 認證模組
負責處理 GitHub Personal Access Token 認證：
- Token 輸入和驗證
- 管理 token 儲存
- 提供登入/登出功能
- 檢查現有的認證狀態

**主要方法：**
- `initAuth(config)` - 初始化認證模組
- `getOctokit()` - 取得 Octokit 實例
- `isAuthenticated()` - 檢查是否已認證

### `js/repo.js` - Repository 模組
處理 GitHub Repository 相關操作：
- 解析 GitHub Repo URL
- 取得檔案列表
- 顯示檔案和資料夾
- 提供檔案圖示映射

**主要方法：**
- `initRepo(config)` - 初始化 Repo 模組
- `clearResults()` - 清除結果顯示

### `js/ui.js` - UI 模組
管理使用者介面相關操作：
- 顯示訊息（成功/錯誤）
- 更新使用者資訊顯示
- 清除使用者資訊

**主要方法：**
- `initUI()` - 初始化 UI 模組
- `showMessage(message, type)` - 顯示訊息
- `showSuccess(message)` - 顯示成功訊息
- `showError(message)` - 顯示錯誤訊息
- `displayUserInfo(user)` - 顯示使用者資訊
- `clearUserInfo()` - 清除使用者資訊

### `js/app.js` - 主應用程式
整合所有模組的入口點：
- 初始化各個模組
- 設定模組間的通訊
- 處理全域事件

## ⚙️ 設定檔

### `config.js`
包含 OAuth 應用程式設定：
```javascript
const CONFIG = {
    clientId: '4beff413792d5dfbd9bf',
    scopes: ['public_repo']
};
```

## 🎨 樣式

### `css/styles.css`
包含所有 UI 樣式，包括：
- 按鈕樣式
- 表單輸入
- 載入動畫
- 檔案列表顯示
- 響應式設計

## 🚀 使用方式

1. 直接在瀏覽器中開啟 `index.html`
2. 點擊「使用 GitHub 登入」
3. 在彈出的頁面中輸入驗證碼並授權
4. 登入成功後，輸入 GitHub Repo URL（例如：`https://github.com/octocat/Hello-World`）
5. 查看該 Repo 的檔案列表

## 🔧 技術特點

- **純前端 SPA**：無需後端伺服器
- **模組化設計**：功能分離，易於維護
- **事件驅動**：使用 CustomEvent 進行模組間通訊
- **ES6 Modules**：使用原生 JavaScript 模組
- **無需建置工具**：直接在瀏覽器中運行
- **localStorage 持久化**：自動記住登入狀態
- **安全性**：Token 僅儲存在本地瀏覽器

## 🔐 安全性說明

1. **Token 儲存**：Token 儲存在瀏覽器的 localStorage 中
2. **僅限本地**：不會傳送到任何第三方伺服器
3. **建議做法**：
   - 使用短期 token（設定較短的過期時間）
   - 不要在公共電腦上使用
   - 使用完畢後記得登出
   - 定期更新 token

## ❓ 為什麼不使用 OAuth Device Flow？

OAuth Device Flow 需要與 GitHub API 進行通訊，但由於瀏覽器的 CORS 政策限制，純前端 SPA 無法直接呼叫 GitHub 的 OAuth API。

解決方案比較：
1. **Personal Access Token**（本專案採用）
   - ✅ 純前端，無需後端
   - ✅ 簡單易用
   - ⚠️ 需要手動產生 token

2. **OAuth Device Flow with Proxy**
   - ✅ 使用者體驗較好
   - ❌ 需要後端代理伺服器
   - ❌ 不符合純前端要求

3. **OAuth Web Flow**
   - ✅ 標準 OAuth 流程
   - ❌ 需要 Client Secret（不安全在前端暴露）
   - ❌ 需要後端伺服器處理回調

## 📦 依賴

- [Octokit.js](https://github.com/octokit/octokit.js) - GitHub API 客戶端

通過 ESM CDN (esm.sh) 載入，無需安裝。

## 🔐 權限

Token 只需要 `public_repo` 權限，僅能存取公開的儲存庫。

## 📝 授權

MIT License
