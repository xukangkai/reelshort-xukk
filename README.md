# ReelShort Platform

ReelShort 是一个短剧内容分发平台，提供短剧视频流媒体播放、后台内容管理和企业门户网站功能。

## 技术栈

| 层级       | 技术                                          |
| ---------- | --------------------------------------------- |
| 框架       | Nuxt 4.5 (Vue 3.5) / uni-app (移动端)         |
| 语言       | TypeScript 5.9                                |
| 样式       | Tailwind CSS 6.14                             |
| 后端/BaaS  | Supabase (Auth、PostgreSQL、Storage)          |
| 视频播放   | video.js 8 + hls.js 1.6 (HLS 流媒体)         |
| 国际化     | @nuxtjs/i18n (中/英双语)                      |
| 部署       | Vercel                                        |
| 包管理     | pnpm 9.15 + pnpm workspace (monorepo)         |

## 项目架构

```
reelshort/
├── reelshort-web/          # 面向终端用户的主站 (port 3000)
├── reelshort-admin/        # 内容管理后台 (port 3001)
├── reelshort-corporate/    # 企业门户网站 (port 3002)
├── reelshort-mobile/       # 移动端 App (uni-app 跨平台)
├── reelshort-shared/       # 共享类型、常量与工具函数 (@reelshort/shared)
└── reelshort-db/           # 数据库迁移脚本与种子数据
```

### 应用说明

#### reelshort-web（用户主站）
面向 C 端用户的短剧流媒体平台，支持视频播放、分类浏览、搜索、追剧列表等功能。采用 ISR（增量静态再生）优化首页和影片详情页的加载性能，支持中英文双语切换。

#### reelshort-admin（管理后台）
内部内容管理系统，支持影片管理、分类/标签管理、VIP 套餐管理、Fandom 文章管理等。通过 Supabase Auth 进行权限控制，全 SPA 模式运行。

#### reelshort-corporate（企业门户）
企业官方网站，包含品牌介绍、粉丝社区、媒体资源、联系方式、隐私政策和服务条款等页面。采用全静态预渲染（SSG）部署。

#### reelshort-mobile（移动端）
基于 uni-app 构建的跨平台移动应用，支持 H5、微信小程序和原生 App 三端发布，使用 Pinia 进行状态管理。

#### reelshort-shared（共享包）
`@reelshort/shared` 是 monorepo 的共享基础库，提供统一的 TypeScript 类型定义、业务常量和工具函数，被 web、admin、corporate 三个应用以 workspace 依赖方式引用，确保各端数据结构一致。

#### reelshort-db（数据库）
存放 Supabase 数据库迁移脚本（`migrations/`）和种子数据（`seed.sql`），包括分类、标签、搜索关键词、Fandom 文章等初始数据。

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 9.15

### 安装依赖

```bash
# 在根目录执行，安装所有 workspace 依赖
pnpm install
```

### 环境变量配置

`reelshort-web` 和 `reelshort-admin` 需要配置 `.env` 文件：

```env
# Supabase 配置
NUXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NUXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NUXT_SUPABASE_SERVICE_KEY=<your-supabase-service-role-key>

# 站点 URL
NUXT_PUBLIC_SITE_URL=http://localhost:<port>

# Cloudflare Stream（可选，用于视频流）
NUXT_CLOUDFLARE_STREAM_TOKEN=
NUXT_CLOUDFLARE_ACCOUNT_ID=
NUXT_PUBLIC_CLOUDFLARE_STREAM_BASE_URL=
```

### 启动开发服务器

```bash
# 启动用户主站 (http://localhost:3000)
pnpm dev:web

# 启动管理后台 (http://localhost:3001)
pnpm dev:admin

# 启动企业门户 (http://localhost:3002)
pnpm dev:corporate
```

### 构建生产版本

```bash
# 单独构建某个应用
pnpm build:web
pnpm build:admin
pnpm build:corporate

# 构建全部应用
pnpm build:all
```

## 开发约定

- **包管理**：统一使用 pnpm，通过 workspace 管理多包依赖
- **类型共享**：跨应用复用的类型、常量定义在 `reelshort-shared`，各应用通过 `@reelshort/shared` 导入
- **数据库变更**：所有 Schema 变更通过 `reelshort-db/migrations/` 下的 SQL 迁移文件管理
- **CSS 方案**：各应用统一使用 Tailwind CSS，入口文件为 `~/assets/css/main.css`
- **部署**：web 和 corporate 应用部署到 Vercel，通过 `vercel.json` 配置路由重写

## 目录结构（各应用通用）

```
reelshort-<app>/
├── app/
│   ├── assets/css/         # 全局样式
│   ├── components/         # Vue 组件
│   ├── composables/        # 组合式函数
│   ├── layouts/            # 布局组件
│   ├── middleware/         # 路由中间件
│   ├── pages/              # 页面路由
│   ├── plugins/            # Nuxt 插件
│   ├── public/             # 静态资源
│   └── server/             # Nitro 服务端路由
├── nuxt.config.ts          # Nuxt 配置
├── tailwind.config.ts      # Tailwind CSS 配置
├── tsconfig.json           # TypeScript 配置
└── package.json
```
