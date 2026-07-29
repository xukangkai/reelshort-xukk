# @reelshort/shared

ReelShort monorepo 共享基础库，提供跨应用复用的类型定义、业务常量和工具函数。

## 定位

`@reelshort/shared` 不是一个独立运行的服务或 API，而是以 **workspace 本地依赖** 的方式被 `reelshort-web`、`reelshort-admin` 和 `reelshort-corporate` 三个应用引用。其源码在构建时被编译打包进各应用的最终产物中，确保三端数据结构和业务逻辑保持一致。

## 导出模块

```ts
// 完整导入
import { ... } from '@reelshort/shared'

// 按子模块导入
import type { Movie, Category } from '@reelshort/shared/types'
import { GENRES, TAG_COLORS } from '@reelshort/shared/constants'
import { formatDuration } from '@reelshort/shared/utils'
```

| 子模块         | 路径                      | 说明           |
| -------------- | ------------------------- | -------------- |
| `.`            | `src/index.ts`            | 汇总导出       |
| `./types`      | `src/types/index.ts`      | TypeScript 类型定义 |
| `./constants`  | `src/constants/index.ts`  | 业务常量与枚举 |
| `./utils`      | `src/utils/index.ts`      | 工具函数       |

## 开发

```bash
# 类型检查（在 monorepo 根目录或本目录执行）
pnpm typecheck
```

## 注意事项

- 修改本包内容后，依赖它的应用会在下次构建时自动获取更新
- 新增类型/常量/工具函数时，需在对应的 `index.ts` 中导出
- 避免引入运行时依赖，本包应尽可能保持纯 TypeScript 定义
