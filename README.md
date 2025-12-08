# SECS Platform Frontend

SECS 平台前端應用程式

## 技術棧

- **Vue 3** - 前端框架
- **Vite** - 建置工具
- **Element Plus** - UI 組件庫
- **Vue Router** - 路由管理
- **Pinia** - 狀態管理

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 環境變數

在專案根目錄創建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:7107
```

## 專案結構

```
src/
├── api/          # API 管理模組
├── components/   # 共用組件
├── router/      # 路由配置
├── store/        # Pinia 狀態管理
└── views/        # 頁面組件
```
