<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()
const dramaId = route.query.drama_id as string

const { data: drama } = useAsyncData(`ep-drama-${dramaId}`, async () => {
  if (!dramaId) return null
  const { data } = await supabase.from('dramas').select('id, title').eq('id', dramaId).single()
  return data
})

const { data: episodes, refresh } = useAsyncData(`episodes-${dramaId}`, async () => {
  if (!dramaId) return []
  const { data } = await supabase
    .from('episodes')
    .select('*')
    .eq('drama_id', dramaId)
    .order('sort_order')
  return data || []
})

const toggleFree = async (ep: any) => {
  await supabase.from('episodes').update({ is_free: !ep.is_free }).eq('id', ep.id)
  await refresh()
}

const deleteEpisode = async (id: string) => {
  if (!confirm('确定删除该单集？')) return
  await supabase.from('episodes').delete().eq('id', id)
  await refresh()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <NuxtLink to="/dramas" class="text-brand text-sm hover:underline">&larr; 返回剧集列表</NuxtLink>
        <h2 class="text-lg font-bold mt-1">{{ drama?.title || '单集管理' }}</h2>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-border overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-light">
          <tr>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">集数</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">标题</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">时长</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">免费</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">金币</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">播放量</th>
            <th class="text-right px-4 py-2 text-xs text-text-muted font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ep in episodes" :key="ep.id" class="border-t border-border hover:bg-surface-light">
            <td class="px-4 py-3 font-medium">{{ ep.episode_number }}</td>
            <td class="px-4 py-3">{{ ep.title || `Episode ${ep.episode_number}` }}</td>
            <td class="px-4 py-3 text-text-secondary">{{ ep.duration_seconds ? `${Math.floor(ep.duration_seconds / 60)}m` : '-' }}</td>
            <td class="px-4 py-3">
              <button @click="toggleFree(ep)" class="px-2 py-0.5 rounded-full text-xs" :class="ep.is_free ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                {{ ep.is_free ? '免费' : '付费' }}
              </button>
            </td>
            <td class="px-4 py-3 text-text-secondary">{{ ep.is_free ? '-' : ep.unlock_coins }}</td>
            <td class="px-4 py-3 text-text-secondary">{{ ep.views_count?.toLocaleString() }}</td>
            <td class="px-4 py-3 text-right">
              <button @click="deleteEpisode(ep.id)" class="text-danger hover:underline text-sm">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!episodes?.length" class="p-8 text-center text-text-muted">暂无单集数据</div>
    </div>
  </div>
</template>
