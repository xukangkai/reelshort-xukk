<script setup lang="ts">
const supabase = useSupabaseClient()
const showForm = ref(false)
const form = reactive({ title: '', image_url: '', link_type: 'drama', link_value: '', is_active: true, sort_order: 0 })

const { data: banners, refresh } = useAsyncData('admin-banners', async () => {
  const { data } = await supabase.from('banners').select('*').order('sort_order')
  return data || []
})

const save = async () => {
  if (form.image_url) {
    await supabase.from('banners').insert(form)
    showForm.value = false
    Object.assign(form, { title: '', image_url: '', link_type: 'drama', link_value: '', is_active: true, sort_order: 0 })
    await refresh()
  }
}

const toggleActive = async (b: any) => {
  await supabase.from('banners').update({ is_active: !b.is_active }).eq('id', b.id)
  await refresh()
}

const deleteBanner = async (id: string) => {
  if (!confirm('确定删除？')) return
  await supabase.from('banners').delete().eq('id', id)
  await refresh()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h2 class="text-lg font-bold">轮播Banner</h2>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-brand text-white rounded-lg text-sm">+ 新建Banner</button>
    </div>
    <div v-if="showForm" class="bg-white rounded-xl border border-border p-4 space-y-3">
      <input v-model="form.title" placeholder="标题" class="w-full px-3 py-2 border border-border rounded-lg" />
      <input v-model="form.image_url" placeholder="图片URL" class="w-full px-3 py-2 border border-border rounded-lg" />
      <select v-model="form.link_type" class="w-full px-3 py-2 border border-border rounded-lg"><option value="drama">剧集</option><option value="shelf">货架</option><option value="url">外部链接</option></select>
      <input v-model="form.link_value" placeholder="链接值 (slug或URL)" class="w-full px-3 py-2 border border-border rounded-lg" />
      <input v-model.number="form.sort_order" type="number" placeholder="排序" class="w-full px-3 py-2 border border-border rounded-lg" />
      <div class="flex gap-2"><button @click="save" class="px-4 py-2 bg-brand text-white rounded-lg text-sm">保存</button><button @click="showForm = false" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">取消</button></div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="b in banners" :key="b.id" class="bg-white rounded-xl border border-border overflow-hidden">
        <div class="aspect-[16/6] bg-surface-light relative">
          <img v-if="b.image_url" :src="b.image_url" class="w-full h-full object-cover" />
          <span v-else class="absolute inset-0 flex items-center justify-center text-text-muted">暂无图片</span>
        </div>
        <div class="p-4 flex items-center justify-between">
          <div>
            <p class="font-medium">{{ b.title || '未命名' }}</p>
            <p class="text-xs text-text-muted">{{ b.link_type }}: {{ b.link_value }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="toggleActive(b)" class="px-2 py-0.5 rounded-full text-xs" :class="b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">{{ b.is_active ? '启用' : '禁用' }}</button>
            <button @click="deleteBanner(b.id)" class="text-danger text-sm hover:underline">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
