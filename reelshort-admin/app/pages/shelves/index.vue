<script setup lang="ts">
const supabase = useSupabaseClient()
const showForm = ref(false)
const form = reactive({ title: '', slug: '', type: 'themed', is_active: true, sort_order: 0 })

const { data: shelves, refresh } = useAsyncData('admin-shelves', async () => {
  const { data } = await supabase.from('shelves').select('*, shelf_items(count)').order('sort_order')
  return data || []
})

const save = async () => {
  if (form.slug) {
    await supabase.from('shelves').upsert(form, { onConflict: 'slug' })
    showForm.value = false
    Object.assign(form, { title: '', slug: '', type: 'themed', is_active: true, sort_order: 0 })
    await refresh()
  }
}

const deleteShelf = async (id: string) => {
  if (!confirm('确定删除？')) return
  await supabase.from('shelves').delete().eq('id', id)
  await refresh()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h2 class="text-lg font-bold">货架管理</h2>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-brand text-white rounded-lg text-sm">+ 新建货架</button>
    </div>
    <div v-if="showForm" class="bg-white rounded-xl border border-border p-4 space-y-3">
      <input v-model="form.title" placeholder="标题" class="w-full px-3 py-2 border border-border rounded-lg" />
      <input v-model="form.slug" placeholder="Slug" class="w-full px-3 py-2 border border-border rounded-lg" />
      <select v-model="form.type" class="w-full px-3 py-2 border border-border rounded-lg"><option v-for="t in ['new_release','top10','themed','trending']" :key="t" :value="t">{{ t === 'new_release' ? '新片上架' : t === 'top10' ? 'Top 10' : t === 'themed' ? '主题精选' : '热播趋势' }}</option></select>
      <input v-model.number="form.sort_order" type="number" placeholder="排序" class="w-full px-3 py-2 border border-border rounded-lg" />
      <div class="flex gap-2"><button @click="save" class="px-4 py-2 bg-brand text-white rounded-lg text-sm">保存</button><button @click="showForm = false" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">取消</button></div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="shelf in shelves" :key="shelf.id" class="bg-white rounded-xl border border-border p-5">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold">{{ shelf.title }}</h3>
          <span class="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{{ shelf.type }}</span>
        </div>
        <p class="text-text-muted text-sm mb-3">{{ shelf.slug }}</p>
        <div class="flex items-center justify-between">
          <span class="text-text-secondary text-xs">状态: {{ shelf.is_active ? '启用' : '禁用' }}</span>
          <button @click="deleteShelf(shelf.id)" class="text-danger text-sm hover:underline">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>
