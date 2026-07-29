<script setup lang="ts">
const { t } = useI18n()
useHead({ title: 'My List - ReelShort' })
const user = useSupabaseUser()
if (!user.value) navigateTo('/login')
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8 pb-20 lg:pb-8">
    <h1 class="text-2xl font-bold mb-6">{{ t('myList.title') }}</h1>
    <div class="text-center py-16 text-text-muted">
      <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      <p class="text-lg font-medium mb-2">{{ t('myList.empty') }}</p>
      <p class="text-sm mb-4">{{ t('myList.emptyDesc') }}</p>
      <NuxtLink to="/" class="inline-flex px-5 py-2.5 bg-brand hover:bg-brand-dark rounded-lg font-medium transition-colors">{{ t('myList.browse') }}</NuxtLink>
    </div>
  </div>
</template>
