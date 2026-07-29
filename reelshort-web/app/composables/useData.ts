import type { Banner, Shelf, Drama } from '@reelshort/shared'

/**
 * 获取首页数据（Banner + Shelves + 热门剧集）
 */
export function useHomeData() {
  const supabase = useSupabaseClient()

  const { data: banners } = useAsyncData('banners', async () => {
    const now = new Date().toISOString()
    const { data } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order('sort_order')
    return (data as Banner[]) || []
  })

  const { data: shelves } = useAsyncData('shelves', async () => {
    const { data } = await supabase
      .from('shelves')
      .select('*, shelf_items(*, dramas:drama_id(*))')
      .eq('is_active', true)
      .order('sort_order')
    return data || []
  })

  const { data: trending } = useAsyncData('trending', async () => {
    const { data } = await supabase
      .from('dramas')
      .select('*')
      .eq('status', 'published')
      .order('trending_score', { ascending: false })
      .limit(20)
    return (data as Drama[]) || []
  })

  return { banners, shelves, trending }
}

/**
 * 获取剧集详情 + 剧集列表
 */
export function useDramaDetail(slug: string) {
  const supabase = useSupabaseClient()

  return useAsyncData(`drama-${slug}`, async () => {
    const { data: drama, error } = await supabase
      .from('dramas')
      .select('*, drama_categories(*, categories(*)), drama_tags(*, tags(*))')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) throw error

    const { data: episodes } = await supabase
      .from('episodes')
      .select('*')
      .eq('drama_id', drama.id)
      .order('episode_number')

    return { ...drama, episodes: (episodes || []).sort((a: any, b: any) => a.episode_number - b.episode_number) }
  })
}

/**
 * 获取分类列表
 */
export function useCategories() {
  const supabase = useSupabaseClient()

  return useAsyncData('categories', async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    return data || []
  })
}

/**
 * 搜索剧集
 */
export function useDramaSearch() {
  const supabase = useSupabaseClient()

  const search = async (query: string) => {
    if (!query || query.length < 2) return []
    const { data } = await supabase
      .from('dramas')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20)
    return (data as Drama[]) || []
  }

  return { search }
}
