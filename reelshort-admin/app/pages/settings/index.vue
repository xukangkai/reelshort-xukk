<script setup lang="ts">
const supabase = useSupabaseClient()

const { data: settings } = useAsyncData('admin-settings', async () => {
  const { data } = await supabase.from('site_settings').select('*').order('category')
  return data || []
})

const settingMap: Record<string, any> = reactive({})
onMounted(() => {
  if (settings.value) {
    settings.value.forEach(s => { settingMap[s.key] = s.value })
  }
})

const saveSetting = async (key: string) => {
  await supabase.from('site_settings').upsert({ key, value: settingMap[key] }, { onConflict: 'key' })
}

const sections = [
  { title: '站点设置', keys: ['site_name', 'site_description', 'site_logo'] },
  { title: '播放器设置', keys: ['watermark_enabled', 'watermark_opacity', 'default_quality', 'autoplay_next', 'preview_duration', 'countdown_duration'] },
  { title: '金币设置', keys: ['coin_packages', 'daily_checkin_rewards', 'signup_bonus'] },
  { title: '功能开关', keys: ['comments_enabled', 'favorites_enabled', 'sharing_enabled', 'fandom_enabled', 'coins_enabled', 'checkin_enabled'] },
]
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <h2 class="text-lg font-bold">系统设置</h2>

    <!-- Site Settings -->
    <div v-for="section in sections" :key="section.title" class="bg-white rounded-xl border border-border p-5">
      <h3 class="font-semibold mb-4">{{ section.title }}</h3>
      <div class="space-y-3">
        <div v-for="key in section.keys" :key="key" class="flex items-center justify-between">
          <label class="text-sm text-text-secondary">{{ key.replace(/_/g, ' ') }}</label>
          <input
            v-model="settingMap[key]"
            @change="saveSetting(key)"
            class="px-3 py-1.5 border border-border rounded-lg text-sm w-48 text-right"
            :placeholder="key"
          />
        </div>
      </div>
    </div>
  </div>
</template>
