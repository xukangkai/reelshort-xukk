<script setup lang="ts">
const supabase = useSupabaseClient()
const showForm = ref(false)
const form = reactive({ name: '', slug: '', description: '', is_active: true, sort_order: 0 })

const { data: categories, refresh } = useAsyncData('admin-categories', async () => {
  const { data } = await supabase.from('categories').select('*').order('sort_order')
  return data || []
})

const save = async () => {
  if (form.slug) {
    await supabase.from('categories').upsert(form, { onConflict: 'slug' })
    showForm.value = false
    Object.assign(form, { name: '', slug: '', description: '', is_active: true, sort_order: 0 })
    await refresh()
  }
}

const toggleActive = async (cat: any) => {
  await supabase.from('categories').update({ is_active: !cat.is_active }).eq('id', cat.id)
  await refresh()
}

const deleteCat = async (id: string) => {
  if (!confirm('确定删除？')) return
  await supabase.from('categories').delete().eq('id', id)
  await refresh()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h2 class="text-lg font-bold">分类管理</h2>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-brand text-white rounded-lg text-sm">+ 新建分类</button>
    </div>
    <div v-if="showForm" class="bg-white rounded-xl border border-border p-4 space-y-3">
      <input v-model="form.name" placeholder="名称" class="w-full px-3 py-2 border border-border rounded-lg" />
      <input v-model="form.slug" placeholder="Slug" class="w-full px-3 py-2 border border-border rounded-lg" />
      <input v-model="form.description" placeholder="描述" class="w-full px-3 py-2 border border-border rounded-lg" />
      <input v-model.number="form.sort_order" type="number" placeholder="排序" class="w-full px-3 py-2 border border-border rounded-lg" />
      <div class="flex gap-2"><button @click="save" class="px-4 py-2 bg-brand text-white rounded-lg text-sm">保存</button><button @click="showForm = false" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">取消</button></div>
    </div>
    <div class="bg-white rounded-xl border border-border">
      <table class="w-full">
        <thead class="bg-surface-light"><tr><th class="text-left px-4 py-2 text-xs text-text-muted">名称</th><th class="text-left px-4 py-2 text-xs text-text-muted">Slug</th><th class="text-left px-4 py-2 text-xs text-text-muted">状态</th><th class="text-left px-4 py-2 text-xs text-text-muted">排序</th><th class="text-right px-4 py-2 text-xs text-text-muted">操作</th></tr></thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id" class="border-t border-border hover:bg-surface-light">
            <td class="px-4 py-3 font-medium">{{ cat.name }}</td>
            <td class="px-4 py-3 text-text-secondary">{{ cat.slug }}</td>
            <td class="px-4 py-3"><button @click="toggleActive(cat)" class="px-2 py-0.5 rounded-full text-xs" :class="cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">{{ cat.is_active ? '启用' : '禁用' }}</button></td>
            <td class="px-4 py-3 text-text-secondary">{{ cat.sort_order }}</td>
            <td class="px-4 py-3 text-right"><button @click="deleteCat(cat.id)" class="text-danger text-sm hover:underline">删除</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
