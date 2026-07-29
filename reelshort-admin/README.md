# reelshort-admin

ReelShort 内容管理后台，供运营和管理团队使用的内部管理系统。

## 功能特性

- 影片内容管理（CRUD、上下架）
- 分类与标签管理
- VIP 套餐管理
- Fandom 文章管理
- 用户认证与权限控制（Supabase Auth）

## 技术栈

- Nuxt 4.5 + Vue 3.5
- Tailwind CSS
- Supabase (Auth + PostgreSQL + Service Role Key)
- @vueuse/nuxt (组合式工具库)
- @reelshort/shared (共享类型与常量)

## 开发

```bash
# 安装依赖（在 monorepo 根目录执行）
pnpm install

# 启动开发服务器 → http://localhost:3001
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 类型检查
pnpm typecheck
```

## 环境变量

在项目根目录创建 `.env` 文件：

```env
NUXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NUXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
NUXT_SUPABASE_SERVICE_KEY=<supabase-service-role-key>
NUXT_PUBLIC_SITE_URL=http://localhost:3001
```

## 渲染模式

管理后台采用全 CSR（客户端渲染）模式运行，所有路由均禁用 SSR，确保后台操作在客户端完成。登录页面通过 Supabase Auth redirect 机制保护。
