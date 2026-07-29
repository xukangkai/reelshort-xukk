<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()
const dramaId = route.query.drama_id as string

const { data: drama } = useAsyncData(`ep-drama-${dramaId}`, async () => {
  if (!dramaId) return null
  const { data } = await supabase.from('dramas').select('id, title, slug').eq('id', dramaId).single()
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

// --- Form state ---
const showForm = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')

// File upload state
const videoFile = ref<File | null>(null)
const thumbnailFile = ref<File | null>(null)
const videoUploading = ref(false)
const thumbnailUploading = ref(false)

const emptyForm = () => ({
  episode_number: 0,
  title: '',
  description: '',
  video_url: '',
  thumbnail_url: '',
  duration_seconds: null as number | null,
  is_free: false,
  unlock_coins: 0,
  sort_order: 0,
  published_at: '',
})

const form = reactive(emptyForm())

const openCreate = () => {
  editingId.value = null
  Object.assign(form, emptyForm())
  videoFile.value = null
  thumbnailFile.value = null
  // 自动填充下一集数
  if (episodes.value?.length) {
    const maxNum = Math.max(...episodes.value.map(ep => ep.episode_number))
    form.episode_number = maxNum + 1
    form.sort_order = maxNum + 1
  } else {
    form.episode_number = 1
    form.sort_order = 1
  }
  formError.value = ''
  showForm.value = true
}

const openEdit = (ep: any) => {
  editingId.value = ep.id
  Object.assign(form, {
    episode_number: ep.episode_number,
    title: ep.title || '',
    description: ep.description || '',
    video_url: ep.video_url || '',
    thumbnail_url: ep.thumbnail_url || '',
    duration_seconds: ep.duration_seconds,
    is_free: ep.is_free,
    unlock_coins: ep.unlock_coins || 0,
    sort_order: ep.sort_order || 0,
    published_at: ep.published_at ? ep.published_at.slice(0, 16) : '',
  })
  videoFile.value = null
  thumbnailFile.value = null
  formError.value = ''
  showForm.value = true
}

// Upload file to Supabase Storage and return public URL
const uploadToStorage = async (file: File, storagePath: string): Promise<string | null> => {
  const { error: uploadErr } = await supabase.storage.from('media').upload(storagePath, file, {
    cacheControl: '3600',
    upsert: true,
  })
  if (uploadErr) throw uploadErr
  const { data: urlData } = supabase.storage.from('media').getPublicUrl(storagePath)
  return urlData.publicUrl
}

// Handle video file selection — auto-upload immediately
const onVideoFileSelected = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  videoFile.value = input.files[0]
  videoUploading.value = true
  formError.value = ''
  try {
    const slug = drama.value?.slug || `drama-${dramaId}`
    const path = `episodes/${dramaId}/${form.episode_number || Date.now()}/video.mp4`
    form.video_url = await uploadToStorage(videoFile.value, path) || ''
  } catch (err: any) {
    formError.value = `视频上传失败：${err.message}`
  } finally {
    videoUploading.value = false
  }
}

// Handle thumbnail file selection — auto-upload immediately
const onThumbnailFileSelected = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  thumbnailFile.value = input.files[0]
  thumbnailUploading.value = true
  formError.value = ''
  try {
    const ext = thumbnailFile.value.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `episodes/${dramaId}/${form.episode_number || Date.now()}/thumbnail.${ext}`
    form.thumbnail_url = await uploadToStorage(thumbnailFile.value, path) || ''
  } catch (err: any) {
    formError.value = `缩略图上传失败：${err.message}`
  } finally {
    thumbnailUploading.value = false
  }
}

const handleSave = async () => {
  saving.value = true
  formError.value = ''
  try {
    const payload = {
      drama_id: dramaId,
      episode_number: form.episode_number,
      title: form.title || null,
      description: form.description || null,
      video_url: form.video_url || null,
      thumbnail_url: form.thumbnail_url || null,
      duration_seconds: form.duration_seconds,
      is_free: form.is_free,
      unlock_coins: form.unlock_coins,
      sort_order: form.sort_order,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
    }
    if (editingId.value) {
      await $fetch(`/api/episodes/${editingId.value}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/episodes', { method: 'POST', body: payload })
    }
    showForm.value = false
    await refresh()
  } catch (e: any) {
    formError.value = e.data?.message || e.message || '保存失败'
  } finally {
    saving.value = false
  }
}

const toggleFree = async (ep: any) => {
  await $fetch(`/api/episodes/${ep.id}`, { method: 'PUT', body: { is_free: !ep.is_free } })
  await refresh()
}

const deleteEpisode = async (id: string) => {
  if (!confirm('确定删除该单集？')) return
  await $fetch(`/api/episodes/${id}`, { method: 'DELETE' })
  await refresh()
}

// Extract filename from URL for display
const filenameFromUrl = (url: string | null) => {
  if (!url) return ''
  try { return decodeURIComponent(url.split('/').pop() || '') } catch { return url }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <NuxtLink to="/dramas" class="text-brand text-sm hover:underline">&larr; 返回剧集列表</NuxtLink>
        <h2 class="text-lg font-bold mt-1">{{ drama?.title || '单集管理' }}</h2>
      </div>
      <button @click="openCreate" class="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg text-sm font-medium transition-colors">
        + 新建单集
      </button>
    </div>

    <!-- 新建/编辑表单 -->
    <div v-if="showForm" class="bg-white rounded-xl border border-border p-5 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">{{ editingId ? '编辑单集' : '新建单集' }}</h3>
        <button @click="showForm = false" class="text-text-muted hover:text-text-secondary text-sm">✕ 关闭</button>
      </div>

      <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{{ formError }}</div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-text-secondary mb-1">集数 <span class="text-red-500">*</span></label>
          <input v-model.number="form.episode_number" type="number" min="1" class="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm text-text-secondary mb-1">排序</label>
          <input v-model.number="form.sort_order" type="number" class="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm text-text-secondary mb-1">时长(秒)</label>
          <input v-model.number="form.duration_seconds" type="number" class="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm text-text-secondary mb-1">解锁金币</label>
          <input v-model.number="form.unlock_coins" type="number" min="0" class="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
      </div>

      <div>
        <label class="block text-sm text-text-secondary mb-1">标题</label>
        <input v-model="form.title" placeholder="单集标题（可选）" class="w-full px-3 py-2 border border-border rounded-lg" />
      </div>

      <div>
        <label class="block text-sm text-text-secondary mb-1">描述</label>
        <textarea v-model="form.description" rows="2" placeholder="单集描述（可选）" class="w-full px-3 py-2 border border-border rounded-lg" />
      </div>

      <!-- 视频上传 -->
      <div>
        <label class="block text-sm text-text-secondary mb-1">视频文件</label>
        <div class="flex items-center gap-3">
          <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm text-blue-700 transition-colors">
            <span v-if="videoUploading" class="animate-pulse">上传中...</span>
            <span v-else>{{ videoFile ? '重新选择' : '选择视频' }}</span>
            <input type="file" accept="video/mp4,video/*" class="hidden" @change="onVideoFileSelected" />
          </label>
          <span v-if="videoFile && !videoUploading" class="text-sm text-green-600 truncate max-w-xs" title="已上传">{{ videoFile.name }}</span>
          <span v-else-if="!videoFile && form.video_url" class="text-sm text-text-muted truncate max-w-xs" title="已有视频">{{ filenameFromUrl(form.video_url) }}</span>
          <span v-else-if="!videoFile && !form.video_url" class="text-sm text-text-muted">未上传</span>
        </div>
      </div>

      <!-- 缩略图上传 -->
      <div>
        <label class="block text-sm text-text-secondary mb-1">缩略图</label>
        <div class="flex items-center gap-3">
          <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm text-blue-700 transition-colors">
            <span v-if="thumbnailUploading" class="animate-pulse">上传中...</span>
            <span v-else>{{ thumbnailFile ? '重新选择' : '选择图片' }}</span>
            <input type="file" accept="image/*" class="hidden" @change="onThumbnailFileSelected" />
          </label>
          <!-- Preview -->
          <img
            v-if="thumbnailFile && !thumbnailUploading"
            :src="form.thumbnail_url || ''"
            class="w-16 h-10 object-cover rounded border border-border"
          />
          <img
            v-else-if="!thumbnailFile && form.thumbnail_url"
            :src="form.thumbnail_url"
            class="w-16 h-10 object-cover rounded border border-border"
          />
          <span v-if="thumbnailFile && !thumbnailUploading" class="text-sm text-green-600 truncate max-w-xs">{{ thumbnailFile.name }}</span>
          <span v-else-if="!thumbnailFile && !form.thumbnail_url" class="text-sm text-text-muted">未上传</span>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center gap-2 mt-5">
          <input v-model="form.is_free" type="checkbox" id="is_free" class="w-4 h-4" />
          <label for="is_free" class="text-sm text-text-secondary">免费集</label>
        </div>
        <div>
          <label class="block text-sm text-text-secondary mb-1">发布时间</label>
          <input v-model="form.published_at" type="datetime-local" class="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
      </div>

      <div class="flex gap-2 pt-2">
        <button
          @click="handleSave"
          :disabled="saving || videoUploading || thumbnailUploading"
          class="px-5 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {{ saving ? '保存中...' : (editingId ? '更新' : '创建') }}
        </button>
        <button @click="showForm = false" class="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">取消</button>
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
              <div class="flex items-center justify-end gap-2">
                <button @click="openEdit(ep)" class="text-brand hover:underline text-sm">编辑</button>
                <button @click="deleteEpisode(ep.id)" class="text-danger hover:underline text-sm">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!episodes?.length" class="p-8 text-center text-text-muted">暂无单集数据，点击右上角「+ 新建单集」添加</div>
    </div>
  </div>
</template>
