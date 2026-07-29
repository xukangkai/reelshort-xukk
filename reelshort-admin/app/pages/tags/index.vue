<script setup lang="ts">
const supabase = useSupabaseClient()
const activeTab = ref('')
const showForm = ref(false)
const form = reactive({ name: '', slug: '', type: 'genre', color: '' })

const { data: tags, refresh } = useAsyncData('admin-tags', async () => {
  let q = supabase.from('tags').select('*')
  if (activeTab.value) q = q.eq('type', activeTab.value)
  const { data } = await q.order('name')
  return data || []
})

const tabs = ['', 'genre', 'actor', 'theme', 'story_pattern']

const save = async () => {
  if (form.slug) {
    await supabase.from('tags').upsert(form, { onConflict: 'slug' })
    showForm.value = false
    Object.assign(form, { name: '', slug: '', type: 'genre', color: '' })
    await refresh()
  }
}

const deleteTag = async (id: string) => {
  if (!confirm('确定删除？')) return
  await supabase.from('tags').delete().eq('id', id)
  await refresh()
}

watch(activeTab, () => refresh())
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h2 class="text-lg font-bold">标签管理</h2>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-brand text-white rounded-lg text-sm">+ 新建标签</button>
    </div>
    <div class="flex gap-2">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" class="px-3 py-1.5 rounded-full text-sm" :class="activeTab === tab ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600'">{{ tab || '全部' }}</button>
    </div>
    <div v-if="showForm" class="bg-white rounded-xl border border-border p-4 space-y-3">
      <input v-model="form.name" placeholder="名称" class="w-full px-3 py-2 border border-border rounded-lg" />
      <input v-model="form.slug" placeholder="Slug" class="w-full px-3 py-2 border border-border rounded-lg" />
      <select v-model="form.type" class="w-full px-3 py-2 border border-border rounded-lg"><option v-for="t in ['genre','actor','theme','story_pattern']" :key="t" :value="t">{{ t === 'genre' ? '题材' : t === 'actor' ? '演员' : t === 'theme' ? '主题' : '故事模式' }}</option></select>
      <input v-model="form.color" type="color" class="w-12 h-10" />
      <div class="flex gap-2"><button @click="save" class="px-4 py-2 bg-brand text-white rounded-lg text-sm">保存</button><button @click="showForm = false" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">取消</button></div>
    </div>
    <div class="bg-white rounded-xl border border-border">
      <table class="w-full">
        <thead class="bg-surface-light"><tr><th class="text-left px-4 py-2 text-xs text-text-muted">名称</th><th class="text-left px-4 py-2 text-xs text-text-muted">类型</th><th class="text-left px-4 py-2 text-xs text-text-muted">颜色</th><th class="text-right px-4 py-2 text-xs text-text-muted">操作</th></tr></thead>
        <tbody>
          <tr v-for="tag in tags" :key="tag.id" class="border-t border-border hover:bg-surface-light">
            <td class="px-4 py-3 font-medium">{{ tag.name }}</td>
            <td class="px-4 py-3"><span class="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{{ tag.type }}</span></td>
            <td class="px-4 py-3"><span v-if="tag.color" class="inline-block w-5 h-5 rounded" :style="{ background: tag.color }" /></td>
            <td class="px-4 py-3 text-right"><button @click="deleteTag(tag.id)" class="text-danger text-sm hover:underline">删除</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
