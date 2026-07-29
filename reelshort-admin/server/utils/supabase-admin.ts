import { createClient } from '@supabase/supabase-js'

/**
 * 创建使用 Service Role Key 的 Supabase 客户端
 * 该客户端绕过 RLS，仅用于服务端 API 路由
 */
export function useSupabaseAdmin() {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const serviceKey = config.supabaseServiceKey

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase URL or Service Key in runtime config')
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
