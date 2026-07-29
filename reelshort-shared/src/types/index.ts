// ============================================
// ReelShort Platform - TypeScript Type Definitions
// ============================================

// --- User & Auth ---
export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  display_name: string | null
  role: UserRole
  is_banned: boolean
  referral_code: string | null
  referred_by: string | null
  created_at: string
  updated_at: string
}

export interface UserCoins {
  user_id: string
  balance: number
  total_purchased: number
  total_earned: number
  updated_at: string
}

export interface CoinTransaction {
  id: string
  user_id: string
  amount: number
  type: CoinTransactionType
  reference_id: string | null
  balance_after: number
  created_at: string
}

// --- Content ---
export interface Drama {
  id: string
  slug: string
  title: string
  description: string | null
  poster_url: string | null
  cover_url: string | null
  status: DramaStatus
  type: DramaType
  total_episodes: number
  free_episodes: number
  views_count: number
  likes_count: number
  rating: number | null
  release_date: string | null
  is_featured: boolean
  trending_score: number
  age_rating: AgeRating
  sensitive_tags: string[] | null
  allowed_regions: string[] | null
  meta_title: string | null
  meta_description: string | null
  translations: Record<string, Record<string, string>> | null
  search_vector: string | null
  created_at: string
  updated_at: string
}

export interface Episode {
  id: string
  drama_id: string
  episode_number: number
  title: string | null
  description: string | null
  video_url: string | null
  thumbnail_url: string | null
  duration_seconds: number | null
  is_free: boolean
  unlock_coins: number
  views_count: number
  sort_order: number
  published_at: string | null
  completion_rate: number | null
  translations: Record<string, Record<string, string>> | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  icon_url: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  translations: Record<string, Record<string, string>> | null
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  slug: string
  name: string
  type: TagType
  color: string | null
  translations: Record<string, Record<string, string>> | null
  created_at: string
  updated_at: string
}

// --- Associations ---
export interface DramaCategory {
  drama_id: string
  category_id: string
}

export interface DramaTag {
  drama_id: string
  tag_id: string
}

// --- Social ---
export interface Comment {
  id: string
  drama_id: string
  episode_id: string | null
  user_id: string
  content: string
  likes_count: number
  parent_id: string | null
  is_approved: boolean
  is_hidden: boolean
  created_at: string
  updated_at: string
}

export interface Favorite {
  user_id: string
  drama_id: string
  created_at: string
}

export interface UserLike {
  user_id: string
  target_type: 'drama' | 'comment'
  target_id: string
  created_at: string
}

// --- Curation ---
export interface Shelf {
  id: string
  slug: string
  title: string
  description: string | null
  type: ShelfType
  cover_url: string | null
  sort_order: number
  is_active: boolean
  translations: Record<string, Record<string, string>> | null
  created_at: string
  updated_at: string
}

export interface ShelfItem {
  id: string
  shelf_id: string
  drama_id: string
  sort_order: number
}

export interface Banner {
  id: string
  title: string | null
  image_url: string
  link_type: 'drama' | 'shelf' | 'url'
  link_value: string
  sort_order: number
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
  created_at: string
  updated_at: string
}

// --- Articles (Fandom) ---
export interface ArticleCategory {
  id: string
  slug: string
  name: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string | null
  cover_url: string | null
  author_id: string | null
  category_id: string | null
  drama_id: string | null
  is_new_release: boolean
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  views_count: number
  translations: Record<string, Record<string, string>> | null
  created_at: string
  updated_at: string
}

/** Article with joined category / author / drama for web display */
export interface ArticleWithRelations extends Article {
  article_categories?: ArticleCategory | null
  profiles?: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url'> | null
  dramas?: Pick<Drama, 'id' | 'slug' | 'title' | 'poster_url'> | null
}

// --- Payments & Orders ---
export interface Order {
  id: string
  order_no: string
  user_id: string
  type: OrderType
  amount: number | null
  currency: string | null
  coins_amount: number
  payment_channel: PaymentChannel | null
  payment_status: OrderStatus
  channel_transaction_id: string | null
  ip_address: string | null
  device_info: Record<string, string> | null
  created_at: string
  paid_at: string | null
}

export interface Refund {
  id: string
  order_id: string
  user_id: string
  amount: number
  reason: string | null
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  processed_by: string | null
  processed_at: string | null
  created_at: string
}

export interface EpisodeUnlock {
  user_id: string
  episode_id: string
  created_at: string
}

// --- Viewing ---
export interface WatchProgress {
  user_id: string
  episode_id: string
  drama_id: string
  progress_seconds: number
  completed: boolean
  updated_at: string
}

export interface Subtitle {
  id: string
  episode_id: string
  language: string
  file_url: string
  is_default: boolean
  created_at: string
}

// --- Notifications & Campaigns ---
export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  type: 'system' | 'promo' | 'drama'
  is_read: boolean
  sent_at: string
}

export interface Campaign {
  id: string
  name: string
  type: 'discount' | 'free_unlock' | 'vip_trial'
  rules: Record<string, unknown>
  starts_at: string
  ends_at: string
  is_active: boolean
  created_at: string
}

export interface PushTask {
  id: string
  title: string
  body: string
  target_segment: string | null
  scheduled_at: string | null
  status: 'draft' | 'scheduled' | 'sent'
  sent_count: number
  open_count: number
  click_count: number
  created_at: string
}

// --- System ---
export interface SiteSetting {
  key: string
  value: Record<string, unknown>
  category: string | null
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  target_type: string | null
  target_id: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface DailyCheckin {
  id: string
  user_id: string
  checkin_date: string
  streak_days: number
  coins_earned: number
}

export interface SearchKeyword {
  keyword: string
  search_count: number
  is_active: boolean
  sort_order: number
}

// --- API Response Types ---
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export interface SearchResult {
  dramas: Drama[]
  categories: Category[]
  tags: Tag[]
}

// --- Enums (as const objects for runtime use) ---
export const DramaStatus = {
  DRAFT: 'draft',
  PUBLISHING: 'publishing',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const
export type DramaStatus = (typeof DramaStatus)[keyof typeof DramaStatus]

export const DramaType = {
  SERIES: 'series',
  MOVIE: 'movie',
  MINI: 'mini',
} as const
export type DramaType = (typeof DramaType)[keyof typeof DramaType]

export const TagType = {
  GENRE: 'genre',
  ACTOR: 'actor',
  THEME: 'theme',
  STORY_PATTERN: 'story_pattern',
} as const
export type TagType = (typeof TagType)[keyof typeof TagType]

export const ShelfType = {
  NEW_RELEASE: 'new_release',
  TOP10: 'top10',
  THEMED: 'themed',
  TRENDING: 'trending',
} as const
export type ShelfType = (typeof ShelfType)[keyof typeof ShelfType]

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const OrderType = {
  TOP_UP: 'top_up',
  UNLOCK: 'unlock',
  VIP: 'vip',
} as const
export type OrderType = (typeof OrderType)[keyof typeof OrderType]

export const OrderStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export const PaymentChannel = {
  APP_STORE: 'app_store',
  GOOGLE_PLAY: 'google_play',
  STRIPE: 'stripe',
} as const
export type PaymentChannel = (typeof PaymentChannel)[keyof typeof PaymentChannel]

export const AgeRating = {
  ALL: 'All',
  TWELVE_PLUS: '12+',
  FIFTEEN_PLUS: '15+',
  EIGHTEEN_PLUS: '18+',
} as const
export type AgeRating = (typeof AgeRating)[keyof typeof AgeRating]

export type CoinTransactionType =
  | 'purchase'
  | 'unlock'
  | 'gift'
  | 'daily_bonus'
  | 'referral'
  | 'streak'

export type CommentStatus = 'pending' | 'approved' | 'rejected'
