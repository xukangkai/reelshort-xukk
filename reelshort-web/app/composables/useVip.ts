/**
 * VIP 会员状态管理
 */
export function useVip() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const isVip = ref(false)
  const vipExpiresAt = ref<string | null>(null)
  const loading = ref(false)

  const checkVip = async () => {
    if (!user.value) {
      isVip.value = false
      return false
    }
    loading.value = true
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('expires_at, status')
        .eq('user_id', user.value.id)
        .eq('status', 'active')
        .order('expires_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data && data.expires_at) {
        const expires = new Date(data.expires_at)
        isVip.value = expires > new Date()
        vipExpiresAt.value = data.expires_at
      } else {
        isVip.value = false
      }
    } catch {
      isVip.value = false
    } finally {
      loading.value = false
    }
    return isVip.value
  }

  const canWatchEpisode = (episode: any) => {
    // 免费集直接放行
    if (episode?.is_free) return true
    // 未登录 → 需要登录
    if (!user.value) return 'login'
    // VIP → 放行
    if (isVip.value) return true
    // 非VIP → 需要支付
    return 'pay'
  }

  return { isVip, vipExpiresAt, loading, checkVip, canWatchEpisode }
}
