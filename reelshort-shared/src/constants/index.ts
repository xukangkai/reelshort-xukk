// ============================================
// ReelShort Platform - Constants
// ============================================

/** 分页默认值 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

/** ISR 缓存时间（秒） */
export const ISR_CACHE = {
  HOME: 300,         // 5分钟
  DETAIL: 120,       // 2分钟
  CATEGORY: 3600,    // 1小时
  ARTICLE: 3600,     // 1小时
} as const

/** 视频播放器配置 */
export const PLAYER = {
  AUTOPLAY_TIMEOUT: 5000,
  SEEK_STEP: 5,           // 快进退步长（秒）
  VOLUME_STEP: 0.1,
  PROGRESS_SAVE_INTERVAL: 5000,   // 每5秒保存进度（客户端）
  PROGRESS_BATCH_INTERVAL: 30000, // 每30秒批量提交到DB
  AUTO_NEXT_COUNTDOWN: 5,         // 自动连播倒计时（秒）
  QUALITY_OPTIONS: ['auto', '480p', '720p', '1080p'] as const,
} as const

/** 搜索配置 */
export const SEARCH = {
  DEBOUNCE_MS: 300,
  MAX_HISTORY: 10,
  MIN_QUERY_LENGTH: 2,
} as const

/** 金币系统默认值 */
export const COINS = {
  DEFAULT_REGISTER_BONUS: 100,
  DEFAULT_DAILY_BONUS: [10, 15, 20, 25, 30, 40, 50],  // 7天签到奖励
} as const

/** 响应式断点 */
export const BREAKPOINTS = {
  SM: 640,    // 手机
  MD: 768,    // 平板
  LG: 1024,   // 电脑
  XL: 1280,   // 大屏
  '2XL': 1536,
} as const

/** 内容分级 */
export const AGE_RATINGS = ['All', '12+', '15+', '18+'] as const

/** 剧集状态流转 */
export const DRAMA_STATUS_FLOW: Record<string, string[]> = {
  draft: ['publishing'],
  publishing: ['published', 'draft'],
  published: ['archived'],
  archived: ['draft'],
}

/** 免费试看时长选项（秒） */
export const FREE_PREVIEW_OPTIONS = [0, 15, 30, 60] as const

/** 导航配置 */
export const NAV_ITEMS = {
  web: [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Categories', path: '/category', icon: 'grid' },
    { label: 'Fandom', path: '/fandom', icon: 'community' },
  ],
  mobileTabs: [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Categories', path: '/category', icon: 'grid' },
    { label: 'My List', path: '/my-list', icon: 'bookmark' },
    { label: 'Profile', path: '/profile', icon: 'user' },
  ],
  admin: [
    { label: 'Dashboard', path: '/', icon: 'chart' },
    { label: 'Dramas', path: '/dramas', icon: 'film' },
    { label: 'Episodes', path: '/episodes', icon: 'play' },
    { label: 'Categories', path: '/categories', icon: 'folder' },
    { label: 'Tags', path: '/tags', icon: 'tag' },
    { label: 'Shelves', path: '/shelves', icon: 'shelf' },
    { label: 'Banners', path: '/banners', icon: 'image' },
    { label: 'Articles', path: '/articles', icon: 'article' },
    { label: 'Users', path: '/users', icon: 'users' },
    { label: 'Comments', path: '/comments', icon: 'chat' },
    { label: 'Orders', path: '/orders', icon: 'receipt' },
    { label: 'Data', path: '/data', icon: 'chart-bar' },
    { label: 'Operations', path: '/operations', icon: 'settings' },
    { label: 'Settings', path: '/settings', icon: 'cog' },
  ],
} as const

/** 社交链接 */
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/reelshort',
  youtube: 'https://youtube.com/@reelshort',
  instagram: 'https://instagram.com/reelshort',
  tiktok: 'https://tiktok.com/@reelshort',
} as const
