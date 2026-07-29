// ============================================
// ReelShort Platform - Utility Functions
// ============================================

/**
 * 格式化数字为简写形式 (5000000 -> "5M", 109100 -> "109.1K")
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

/**
 * 格式化时长 (秒 -> "1:23:45" 或 "23:45")
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * 格式化日期为相对时间 (3天前, 2小时前等)
 */
export function formatDate(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 30) return `${diffDay}d ago`
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * 格式化日期为 ISO 短日期 (YYYY-MM-DD)
 */
export function formatDateShort(date: string | Date): string {
  return new Date(date).toISOString().split('T')[0]
}

/**
 * 生成 URL 友好的 slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * 截断文本，超出部分用省略号
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

/**
 * 计算热度分数 (用于排行)
 * 基于播放量、点赞数、评论数的加权公式，时间衰减
 */
export function calculateTrendingScore(
  views: number,
  likes: number,
  comments: number,
  createdAt: string | Date,
): number {
  const ageHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
  const gravity = 1.8
  const score = views * 1 + likes * 3 + comments * 5
  return score / Math.pow(ageHours + 2, gravity)
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 生成唯一订单号
 */
export function generateOrderNo(prefix = 'RS'): string {
  const now = new Date()
  const timestamp = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

/**
 * 生成随机邀请码
 */
export function generateReferralCode(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * 解析分页参数
 */
export function parsePaginationParams(
  query: Record<string, string | undefined>,
  defaults = { page: 1, pageSize: 20 },
): { page: number; pageSize: number; offset: number } {
  const page = Math.max(1, parseInt(query.page || '') || defaults.page)
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize || '') || defaults.pageSize))
  return { page, pageSize, offset: (page - 1) * pageSize }
}

/**
 * 构建 Supabase 排序参数
 */
export function parseSortParams(
  query: Record<string, string | undefined>,
  defaultSort = 'created_at',
  defaultOrder: 'asc' | 'desc' = 'desc',
): { column: string; ascending: boolean } {
  const column = query.sortBy || defaultSort
  const ascending = (query.sortOrder || defaultOrder) === 'asc'
  return { column, ascending }
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 从 JSONB translations 字段获取指定语种的文本
 */
export function getTranslation(
  translations: Record<string, Record<string, string>> | null | undefined,
  locale: string,
  field: string,
  fallback?: string,
): string | undefined {
  if (!translations) return fallback
  return translations[locale]?.[field] ?? translations.en?.[field] ?? fallback
}
