# reelshort-web

ReelShort 用户主站，面向终端用户的短剧流媒体平台。

## 功能特性

- 短剧视频播放（HLS 流媒体，基于 video.js + hls.js）
- 影片分类浏览与搜索
- 追剧列表（My List）
- 用户个人中心
- 中英文双语切换（i18n）
- ISR 增量静态再生优化首屏性能

## 技术栈

- Nuxt 4.5 + Vue 3.5
- Tailwind CSS
- Supabase (Auth + PostgreSQL)
- video.js + hls.js (视频播放)
- @nuxtjs/i18n (国际化)
- @vueuse/nuxt (组合式工具库)

## 开发

```bash
# 安装依赖（在 monorepo 根目录执行）
pnpm install

# 启动开发服务器 → http://localhost:3000
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
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_CLOUDFLARE_STREAM_TOKEN=<cloudflare-stream-token>
NUXT_CLOUDFLARE_ACCOUNT_ID=<cloudflare-account-id>
NUXT_PUBLIC_CLOUDFLARE_STREAM_BASE_URL=<cloudflare-stream-base-url>
```

## 路由策略

| 路由          | 渲染模式 | 缓存时间 |
| ------------- | -------- | -------- |
| `/`           | ISR      | 300s     |
| `/movie/**`   | ISR      | 120s     |
| `/category/**`| ISR      | 3600s    |
| `/fandom/**`  | ISR      | 3600s    |
| `/search`     | CSR      | -        |
| `/my-list`    | CSR      | -        |
| `/profile`    | CSR      | -        |
