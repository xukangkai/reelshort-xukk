<script setup lang="ts">
const supabase = useSupabaseClient()
const search = ref('')
const statusFilter = ref('')

const { data: dramas, refresh } = useAsyncData('dramas-list', async () => {
  let query = supabase.from('dramas').select('*').order('created_at', { ascending: false }).limit(50)
  if (statusFilter.value) query = query.eq('status', statusFilter.value)
  if (search.value) query = query.ilike('title', `%${search.value}%`)
  const { data } = await query
  return data || []
})

const deleteDrama = async (id: string) => {
  if (!confirm('确定删除该剧集？')) return
  await supabase.from('dramas').delete().eq('id', id)
  await refresh()
}

watch([search, statusFilter], () => refresh())
</script>

<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex gap-2">
        <input v-model="search" placeholder="搜索剧集..." class="px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-brand" />
        <select v-model="statusFilter" class="px-3 py-2 border border-border rounded-lg bg-white">
          <option value="">全部状态</option>
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
          <option value="archived">已归档</option>
        </select>
      </div>
      <NuxtLink to="/dramas/new" class="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg text-sm font-medium transition-colors">
        + 新建剧集
      </NuxtLink>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-border overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-light">
          <tr>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">剧名</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">状态</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">集数</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">播放量</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">评分</th>
            <th class="text-right px-4 py-2 text-xs text-text-muted font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in dramas" :key="d.id" class="border-t border-border hover:bg-surface-light">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img v-if="d.poster_url" :src="d.poster_url" class="w-10 h-14 object-cover rounded" />
                <div class="w-10 h-14 bg-surface-dark rounded" v-else />
                <div>
                  <p class="font-medium">{{ d.title }}</p>
                  <p class="text-xs text-text-muted">{{ d.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded-full text-xs" :class="{
                'bg-green-100 text-green-700': d.status === 'published',
                'bg-yellow-100 text-yellow-700': d.status === 'draft',
                'bg-blue-100 text-blue-700': d.status === 'publishing',
                'bg-gray-100 text-gray-700': d.status === 'archived',
              }">{{ d.status === 'published' ? '已发布' : d.status === 'draft' ? '草稿' : d.status === 'publishing' ? '发布中' : '已归档' }}</span>
            </td>
            <td class="px-4 py-3 text-text-secondary">{{ d.total_episodes }}集 ({{ d.free_episodes }}集免费)</td>
            <td class="px-4 py-3 text-text-secondary">{{ d.views_count?.toLocaleString() }}</td>
            <td class="px-4 py-3 text-text-secondary">{{ d.rating || '-' }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink :to="`/dramas/${d.id}/edit`" class="text-brand hover:underline text-sm">编辑</NuxtLink>
                <NuxtLink :to="`/episodes?drama_id=${d.id}`" class="text-blue-600 hover:underline text-sm">单集</NuxtLink>
                <button @click="deleteDrama(d.id)" class="text-danger hover:underline text-sm">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!dramas?.length" class="p-8 text-center text-text-muted">暂无剧集数据</div>
    </div>
  </div>
</template>
