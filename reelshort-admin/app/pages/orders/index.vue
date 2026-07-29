<script setup lang="ts">
const supabase = useSupabaseClient()
const statusFilter = ref('')

const { data: orders } = useAsyncData('admin-orders', async () => {
  let q = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50)
  if (statusFilter.value) q = q.eq('payment_status', statusFilter.value)
  const { data } = await q
  return data || []
})

watch(statusFilter, () => useAsyncData('admin-orders', async () => {
  let q = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50)
  if (statusFilter.value) q = q.eq('payment_status', statusFilter.value)
  const { data } = await q
  return data || []
}))
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h2 class="text-lg font-bold">订单管理</h2>
      <select v-model="statusFilter" class="px-3 py-2 border border-border rounded-lg">
        <option value="">全部状态</option>
        <option value="pending">待支付</option>
        <option value="paid">已支付</option>
        <option value="failed">失败</option>
        <option value="refunded">已退款</option>
      </select>
    </div>
    <div class="bg-white rounded-xl border border-border">
      <table class="w-full">
        <thead class="bg-surface-light"><tr><th class="text-left px-4 py-2 text-xs text-text-muted">订单号</th><th class="text-left px-4 py-2 text-xs text-text-muted">类型</th><th class="text-left px-4 py-2 text-xs text-text-muted">金币</th><th class="text-left px-4 py-2 text-xs text-text-muted">金额</th><th class="text-left px-4 py-2 text-xs text-text-muted">状态</th><th class="text-left px-4 py-2 text-xs text-text-muted">日期</th></tr></thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id" class="border-t border-border hover:bg-surface-light">
            <td class="px-4 py-3 font-mono text-sm">{{ o.order_no?.slice(0, 12) }}...</td>
            <td class="px-4 py-3"><span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{{ o.type }}</span></td>
            <td class="px-4 py-3 text-text-secondary">{{ o.coins_amount }}</td>
            <td class="px-4 py-3 text-text-secondary">{{ o.amount ? `$${o.amount}` : '-' }} {{ o.currency || '' }}</td>
            <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-xs" :class="{'bg-green-100 text-green-700': o.payment_status === 'paid','bg-yellow-100 text-yellow-700': o.payment_status === 'pending','bg-red-100 text-red-700': o.payment_status === 'failed','bg-gray-100 text-gray-700': o.payment_status === 'refunded'}">{{ o.payment_status }}</span></td>
            <td class="px-4 py-3 text-text-muted text-sm">{{ new Date(o.created_at).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!orders?.length" class="p-8 text-center text-text-muted">暂无订单</div>
    </div>
  </div>
</template>
