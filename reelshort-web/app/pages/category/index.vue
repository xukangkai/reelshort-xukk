<script setup lang="ts">
const { t } = useI18n()
const supabase = useSupabaseClient()
const { data: categories } = await useCategories()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8 pb-20 lg:pb-8">
    <h1 class="text-2xl font-bold mb-6">{{ t('category.title') }}</h1>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.id"
        :to="`/category/${cat.slug}`"
        class="bg-surface-light hover:bg-surface-lighter rounded-xl p-6 text-center transition-colors group"
      >
        <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-surface-lighter group-hover:bg-brand/20 flex items-center justify-center transition-colors">
          <svg class="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2m0 2a2 2 0 012 2v1a2 2 0 01-2 2 2 2 0 01-2-2V6a2 2 0 012-2zm0 10v2m0-2a2 2 0 01-2-2v-1a2 2 0 012-2 2 2 0 012 2v1a2 2 0 01-2 2zM17 4v2m0-2a2 2 0 00-2 2v1a2 2 0 002 2 2 2 0 002-2V6a2 2 0 00-2-2zm0 10v2m0-2a2 2 0 00-2-2v-1a2 2 0 002-2 2 2 0 002 2v1a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h3 class="font-semibold">{{ cat.name }}</h3>
        <p v-if="cat.description" class="text-text-muted text-xs mt-1 line-clamp-2">{{ cat.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
