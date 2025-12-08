# API 管理模块

这是一个完整的 API 管理模板，提供了统一的 HTTP 请求封装、拦截器机制和模块化的 API 服务。

## 目录结构

```
src/api/
├── config.js          # API 配置文件（基础 URL、端点等）
├── request.js         # HTTP 请求封装（基于 fetch）
├── interceptors.js    # 请求/响应拦截器配置
├── index.js           # 统一导出
├── services/          # API 服务模块
│   ├── index.js       # 服务统一导出
│   ├── auth.js        # 认证相关 API
│   ├── secs.js        # SECS 相关 API
│   ├── alarm.js       # 告警相关 API
│   ├── carrier.js     # 载具相关 API
│   ├── vehicle.js     # 车辆相关 API
│   └── log.js         # 日志相关 API
└── README.md          # 说明文档
```

## 使用方法

### 1. 基本使用

```javascript
import { get, post } from "@/api";

// GET 请求
const data = await get("/api/users", { page: 1, pageSize: 10 });

// POST 请求
const result = await post("/api/users", {
  name: "John",
  email: "john@example.com",
});
```

### 2. 使用服务模块

```javascript
import { getAlarmList, createAlarm } from "@/api/services/alarm";

// 获取告警列表
const alarms = await getAlarmList({ page: 1, pageSize: 20 });

// 创建告警
const newAlarm = await createAlarm({
  title: "系统告警",
  level: "high",
  message: "系统异常",
});
```

### 3. 配置 API 基础 URL

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:5000
```

或者在 `src/api/config.js` 中直接修改 `baseURL`。

### 4. 自定义请求配置

```javascript
import { request } from "@/api";

const data = await request({
  url: "/api/custom",
  method: "POST",
  data: { key: "value" },
  headers: {
    "Custom-Header": "value",
  },
  timeout: 60000, // 60 秒
  showError: false, // 不显示错误消息
});
```

### 5. 添加自定义拦截器

```javascript
import { addRequestInterceptor, addResponseInterceptor } from "@/api";

// 添加请求拦截器
addRequestInterceptor((config) => {
  // 在请求发送前修改配置
  config.headers["X-Request-ID"] = generateRequestId();
  return config;
});

// 添加响应拦截器
addResponseInterceptor(
  // 成功处理
  (response) => {
    console.log("请求成功:", response);
    return response;
  },
  // 错误处理
  (error) => {
    console.error("请求失败:", error);
    return Promise.reject(error);
  }
);
```

## 功能特性

- ✅ 基于原生 fetch API，无需额外依赖
- ✅ 统一的请求/响应拦截器机制
- ✅ 自动处理 Token 认证
- ✅ 自动错误处理和消息提示
- ✅ 支持超时控制
- ✅ 支持 FormData 上传
- ✅ TypeScript 友好的 API 设计
- ✅ 模块化的服务组织

## 错误处理

API 模块会自动处理常见错误：

- **401 未授权**: 自动清除 Token 并提示重新登录
- **403 禁止访问**: 显示权限错误提示
- **404 未找到**: 显示资源不存在提示
- **500+ 服务器错误**: 显示服务器错误提示
- **网络错误/超时**: 显示网络错误提示

可以通过 `showError: false` 禁用自动错误提示。

## 扩展服务

要添加新的 API 服务：

1. 在 `src/api/config.js` 的 `API_ENDPOINTS` 中添加端点
2. 在 `src/api/services/` 中创建新的服务文件
3. 在 `src/api/services/index.js` 中导出新服务

示例：

```javascript
// src/api/services/example.js
import { get, post } from "../request";
import { API_ENDPOINTS } from "../config";

export function getExampleList(params) {
  return get(API_ENDPOINTS.example.list, params);
}
```
