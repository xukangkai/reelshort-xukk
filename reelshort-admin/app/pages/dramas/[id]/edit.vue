<script setup lang="ts">
const supabase = useSupabaseClient()
const route = useRoute()
const dramaId = route.params.id ? Number(route.params.id) : null
const isNew = !dramaId

const form = reactive({
  title: '',
  slug: '',
  description: '',
  poster_url: '',
  cover_url: '',
  status: 'draft',
  total_episodes: 0,
  free_episodes: 0,
  age_rating: 'PG-13',
  category_id: null as number | null,
})

const { data: categories } = useAsyncData('cats', async () => {
  const { data } = await supabase.from('categories').select('id, name').order('name')
  return data || []
})

if (dramaId) {
  const { data: drama } = await supabase.from('dramas').select('*').eq('id', dramaId).single()
  if (drama) Object.assign(form, {
    title: drama.title,
    slug: drama.slug,
    description: drama.description,
    poster_url: drama.poster_url,
    cover_url: drama.cover_url,
    status: drama.status,
    total_episodes: drama.total_episodes,
    free_episodes: drama.free_episodes,
    age_rating: drama.age_rating,
    category_id: drama.category_id,
  })
}

const saving = ref(false)
const error = ref('')

const handleSave = async () => {
  saving.value = true
  error.value = ''
  try {
    if (isNew) {
      const { error: err } = await supabase.from('dramas').insert(form)
      if (err) error.value = err.message
      else navigateTo('/dramas')
    } else {
      const { error: err } = await supabase.from('dramas').update(form).eq('id', dramaId)
      if (err) error.value = err.message
      else navigateTo('/dramas')
    }
  } catch (e: any) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl space-y-4">
    <NuxtLink to="/dramas" class="text-brand text-sm hover:underline">&larr; 返回剧集列表</NuxtLink>
    <h2 class="text-lg font-bold">{{ isNew ? '新建剧集' : '编辑剧集' }}</h2>

    <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{{ error }}</div>

    <div class="bg-white rounded-xl border border-border p-6 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-text-secondary mb-1">剧名</label>
          <input v-model="form.title" class="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm text-text-secondary mb-1">Slug</label>
          <input v-model="form.slug" class="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
      </div>

      <div>
        <label class="block text-sm text-text-secondary mb-1">简介</label>
        <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border border-border rounded-lg" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-text-secondary mb-1">海报URL</label>
          <input v-model="form.poster_url" class="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm text-text-secondary mb-1">封面URL</label>
          <input v-model="form.cover_url" class="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-text-secondary mb-1">状态</label>
          <select v-model="form.status" class="w-full px-3 py-2 border border-border rounded-lg">
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
            <option value="archived">已归档</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-text-secondary mb-1">总集数</label>
          <input v-model.number="form.total_episodes" type="number" class="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm text-text-secondary mb-1">免费集数</label>
          <input v-model.number="form.free_episodes" type="number" class="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm text-text-secondary mb-1">年龄分级</label>
          <select v-model="form.age_rating" class="w-full px-3 py-2 border border-border rounded-lg">
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm text-text-secondary mb-1">分类</label>
        <select v-model="form.category_id" class="w-full px-3 py-2 border border-border rounded-lg">
          <option :value="null">未分类</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <div class="flex gap-3 pt-4">
        <button @click="handleSave" :disabled="saving" class="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium disabled:opacity-50">
          {{ saving ? '保存中...' : '保存' }}
        </button>
        <NuxtLink to="/dramas" class="px-6 py-2.5 bg-gray-100 rounded-lg font-medium hover:bg-gray-200">取消</NuxtLink>
      </div>
    </div>
  </div>
</template>
