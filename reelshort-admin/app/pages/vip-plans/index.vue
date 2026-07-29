<script setup lang="ts">
const supabase = useSupabaseClient()

const { data: vipPlans, refresh } = useAsyncData('vip-plans-admin', async () => {
  const { data } = await supabase.from('vip_plans').select('*').order('sort_order')
  return data || []
})

const editingPlan = ref<any>(null)
const planForm = reactive({ name: '', plan_key: '', price: 0, currency: 'USD', duration_days: 0, badge: '', sort_order: 0, is_active: true })

const startEdit = (plan: any) => {
  editingPlan.value = plan
  Object.assign(planForm, {
    name: plan.name, plan_key: plan.plan_key, price: Number(plan.price),
    currency: plan.currency, duration_days: plan.duration_days,
    badge: plan.badge, sort_order: plan.sort_order, is_active: plan.is_active
  })
}

const savePlan = async () => {
  if (editingPlan.value) {
    await supabase.from('vip_plans').update(planForm).eq('id', editingPlan.value.id)
  }
  editingPlan.value = null
  refresh()
}

const cancelEdit = () => { editingPlan.value = null }

const togglePlanActive = async (plan: any) => {
  await supabase.from('vip_plans').update({ is_active: !plan.is_active }).eq('id', plan.id)
  refresh()
}
</script>

<template>
  <div class="max-w-3xl">
    <div class="bg-white rounded-xl border border-border p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-semibold text-lg">VIP 套餐配置</h3>
        <p class="text-sm text-text-muted">前端支付弹窗从此表读取套餐信息</p>
      </div>

      <div class="space-y-3">
        <div v-for="plan in vipPlans" :key="plan.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div class="flex-1">
            <span class="font-medium text-base">{{ plan.name }}</span>
            <span class="text-text-secondary text-sm ml-2">({{ plan.plan_key }})</span>
            <span v-if="plan.badge" class="ml-2 px-2 py-0.5 bg-brand/10 text-brand text-xs rounded-full font-medium">{{ plan.badge }}</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-brand font-bold text-lg">${{ Number(plan.price).toFixed(2) }}</span>
            <span class="text-text-muted text-sm w-16 text-center">{{ plan.duration_days }}天</span>
            <span :class="plan.is_active ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'" class="px-2 py-0.5 rounded text-xs font-medium">
              {{ plan.is_active ? '启用' : '禁用' }}
            </span>
            <button @click="startEdit(plan)" class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 font-medium">编辑</button>
            <button @click="togglePlanActive(plan)" class="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-100 font-medium" :class="plan.is_active ? 'text-red-500' : 'text-green-600'">
              {{ plan.is_active ? '禁用' : '启用' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <Transition name="slide">
        <div v-if="editingPlan" class="mt-6 p-5 border-2 border-brand rounded-xl bg-brand/5">
          <h4 class="font-medium mb-4 text-brand">编辑套餐: {{ editingPlan.name }}</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-text-secondary mb-1">套餐名称</label>
              <input v-model="planForm.name" class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none" />
            </div>
            <div>
              <label class="block text-xs text-text-secondary mb-1">套餐标识</label>
              <input v-model="planForm.plan_key" disabled class="w-full px-3 py-2 border border-border rounded-lg text-sm bg-gray-100 text-text-muted" />
            </div>
            <div>
              <label class="block text-xs text-text-secondary mb-1">价格 (USD)</label>
              <input v-model.number="planForm.price" type="number" step="0.01" class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none" />
            </div>
            <div>
              <label class="block text-xs text-text-secondary mb-1">有效天数</label>
              <input v-model.number="planForm.duration_days" type="number" class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none" />
            </div>
            <div>
              <label class="block text-xs text-text-secondary mb-1">角标文字</label>
              <input v-model="planForm.badge" class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none" placeholder="如: Best Value, Save 20%" />
            </div>
            <div>
              <label class="block text-xs text-text-secondary mb-1">排序 (越小越靠前)</label>
              <input v-model.number="planForm.sort_order" type="number" class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none" />
            </div>
          </div>
          <div class="flex gap-2 mt-5">
            <button @click="savePlan" class="px-5 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors">保存修改</button>
            <button @click="cancelEdit" class="px-5 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors">取消</button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
