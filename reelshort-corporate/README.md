# reelshort-corporate

ReelShort 企业门户网站，面向公众和合作伙伴的官方网站。

## 功能特性

- 品牌介绍与关于我们
- 粉丝社区（Fandom）
- 媒体资源与新闻（Press）
- 联系方式
- 隐私政策与服务条款
- 应用下载引导页

## 技术栈

- Nuxt 4.5 + Vue 3.5
- Tailwind CSS
- @nuxt/image (图片优化)
- @vueuse/nuxt (组合式工具库)
- @reelshort/shared (共享类型与常量)

## 开发

```bash
# 安装依赖（在 monorepo 根目录执行）
pnpm install

# 启动开发服务器 → http://localhost:3002
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 类型检查
pnpm typecheck
```

## 渲染模式

企业门户采用全静态预渲染（SSG）模式，所有页面在构建时生成静态 HTML，通过 Nitro prerender 实现。预渲染路由包括：

```
/ /fandom /about /press /contact /privacy /terms /download
```

无需配置 Supabase 等后端环境变量，部署到 Vercel 后以纯静态站点形式运行。
