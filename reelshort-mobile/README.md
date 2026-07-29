# reelshort-mobile

ReelShort 移动端应用，基于 uni-app 构建的跨平台短剧播放客户端。

## 支持平台

- H5（移动浏览器）
- 微信小程序
- 原生 App（iOS / Android）

## 技术栈

- uni-app 3.0 (Vue 3)
- Pinia (状态管理)
- Supabase JS SDK (@supabase/supabase-js)
- TypeScript
- Vite

## 开发

```bash
# H5 开发模式（默认浏览器预览）
pnpm dev:h5

# 微信小程序开发模式
pnpm dev:mp-weixin

# App 开发模式
pnpm dev:app
```

## 构建

```bash
# 构建 H5 版本
pnpm build:h5

# 构建微信小程序版本
pnpm build:mp-weixin

# 构建 App 版本
pnpm build:app

# 类型检查
pnpm type-check
```

## 注意事项

- 本模块不在 monorepo workspace 配置中，独立管理依赖
- 使用 Supabase JS SDK 直接对接后端，不依赖 Nuxt 模块
- 构建产物输出到 `dist/` 目录，微信小程序产物可通过微信开发者工具打开
