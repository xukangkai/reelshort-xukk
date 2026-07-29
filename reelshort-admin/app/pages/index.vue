<script setup lang="ts">
const supabase = useSupabaseClient()

const { data: stats } = useAsyncData('admin-stats', async () => {
  const [dramasR, usersR, ordersR] = await Promise.all([
    supabase.from('dramas').select('id, views_count, status', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('amount', { count: 'exact', head: true }).eq('payment_status', 'paid'),
  ])
  return {
    totalDramas: dramasR.count || 0,
    totalUsers: usersR.count || 0,
    totalOrders: ordersR.count || 0,
  }
})

const { data: recentDramas } = useAsyncData('recent-dramas', async () => {
  const { data } = await supabase
    .from('dramas')
    .select('id, title, poster_url, status, views_count, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
})
</script>

<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-5 border border-border">
        <p class="text-text-muted text-xs">剧集总数</p>
        <p class="text-2xl font-bold mt-1">{{ stats?.totalDramas || 0 }}</p>
      </div>
      <div class="bg-white rounded-xl p-5 border border-border">
        <p class="text-text-muted text-xs">用户总数</p>
        <p class="text-2xl font-bold mt-1">{{ stats?.totalUsers || 0 }}</p>
      </div>
      <div class="bg-white rounded-xl p-5 border border-border">
        <p class="text-text-muted text-xs">已支付订单</p>
        <p class="text-2xl font-bold mt-1">{{ stats?.totalOrders || 0 }}</p>
      </div>
    </div>

    <!-- Recent Dramas -->
    <div class="bg-white rounded-xl border border-border">
      <div class="p-4 border-b border-border flex items-center justify-between">
        <h3 class="font-semibold">最新剧集</h3>
        <NuxtLink to="/dramas" class="text-brand text-sm hover:underline">查看全部</NuxtLink>
      </div>
      <table class="w-full">
        <thead class="bg-surface-light">
          <tr>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">剧名</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">状态</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">播放量</th>
            <th class="text-left px-4 py-2 text-xs text-text-muted font-medium">创建日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in recentDramas" :key="d.id" class="border-t border-border hover:bg-surface-light">
            <td class="px-4 py-3 font-medium">{{ d.title }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded-full text-xs" :class="{
                'bg-green-100 text-green-700': d.status === 'published',
                'bg-yellow-100 text-yellow-700': d.status === 'draft',
                'bg-gray-100 text-gray-700': d.status === 'archived',
              }">{{ d.status === 'published' ? '已发布' : d.status === 'draft' ? '草稿' : '已归档' }}</span>
            </td>
            <td class="px-4 py-3 text-text-secondary">{{ d.views_count.toLocaleString() }}</td>
            <td class="px-4 py-3 text-text-muted">{{ new Date(d.created_at).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
