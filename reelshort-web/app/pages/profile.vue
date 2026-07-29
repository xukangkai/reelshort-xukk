<script setup lang="ts">
const { t } = useI18n()
useHead({ title: 'Profile - ReelShort' })
const user = useSupabaseUser()
const supabase = useSupabaseClient()

if (!user.value) navigateTo('/login')

const handleLogout = async () => {
  await supabase.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 pb-20 lg:pb-8">
    <h1 class="text-2xl font-bold mb-6">{{ t('profile.title') }}</h1>

    <div v-if="user" class="space-y-6">
      <!-- User Info Card -->
      <div class="bg-surface rounded-xl p-6 flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-2xl font-bold">
          {{ user.email?.[0]?.toUpperCase() || 'U' }}
        </div>
        <div>
          <p class="font-semibold text-lg">{{ user.user_metadata?.username || user.email }}</p>
          <p class="text-text-muted text-sm">{{ user.email }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <NuxtLink to="/my-list" class="bg-surface rounded-xl p-4 text-center hover:bg-surface-light transition-colors">
          <p class="text-2xl mb-1">📚</p>
          <p class="text-sm font-medium">{{ t('profile.myList') }}</p>
        </NuxtLink>
        <div class="bg-surface rounded-xl p-4 text-center">
          <p class="text-2xl mb-1">🪙</p>
          <p class="text-sm font-medium">{{ t('profile.coins') }}</p>
        </div>
        <div class="bg-surface rounded-xl p-4 text-center">
          <p class="text-2xl mb-1">⭐</p>
          <p class="text-sm font-medium">VIP</p>
        </div>
        <NuxtLink to="/help" class="bg-surface rounded-xl p-4 text-center hover:bg-surface-light transition-colors">
          <p class="text-2xl mb-1">❓</p>
          <p class="text-sm font-medium">{{ t('profile.help') }}</p>
        </NuxtLink>
      </div>

      <!-- Settings -->
      <div class="bg-surface rounded-xl divide-y divide-border">
        <button class="w-full p-4 text-left hover:bg-surface-light transition-colors flex items-center justify-between">
          <span>{{ t('profile.notifications') }}</span>
          <svg class="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <button class="w-full p-4 text-left hover:bg-surface-light transition-colors flex items-center justify-between">
          <span>{{ t('profile.language') }}</span>
          <svg class="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <button @click="handleLogout" class="w-full p-4 text-left text-red-400 hover:bg-surface-light transition-colors">
          {{ t('profile.signOut') }}
        </button>
      </div>
    </div>
  </div>
</template>
