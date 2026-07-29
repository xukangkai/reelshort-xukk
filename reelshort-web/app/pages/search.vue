<script setup lang="ts">
const { t } = useI18n()
const query = ref('')
const results = ref<any[]>([])
const { search } = useDramaSearch()
const searchHistory = ref<string[]>([])

onMounted(() => {
  const stored = localStorage.getItem('search_history')
  if (stored) searchHistory.value = JSON.parse(stored)
})

const doSearch = async () => {
  if (query.value.length < 2) return
  results.value = await search(query.value)
  // Save to history
  const h = [query.value, ...searchHistory.value.filter(s => s !== query.value)].slice(0, 10)
  searchHistory.value = h
  localStorage.setItem('search_history', JSON.stringify(h))
}

const debouncedSearch = useDebounceFn(doSearch, 300)
watch(query, debouncedSearch)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-8">
    <!-- Search Input -->
    <div class="relative mb-6">
      <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="query"
        type="text"
        :placeholder="t('search.placeholder')"
        class="w-full pl-12 pr-4 py-3 bg-surface-light border border-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-brand"
      />
    </div>

    <!-- Search History -->
    <div v-if="!query && searchHistory.length" class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-sm">{{ t('search.recent') }}</h3>
        <button @click="searchHistory = []; localStorage.removeItem('search_history')" class="text-text-muted text-xs">{{ t('search.clear') }}</button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="h in searchHistory"
          :key="h"
          @click="query = h"
          class="px-3 py-1.5 bg-surface-light rounded-full text-sm text-text-secondary hover:bg-surface-lighter"
        >
          {{ h }}
        </button>
      </div>
    </div>

    <!-- Results -->
    <div v-if="results.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <DramaCard v-for="drama in results" :key="drama.id" :drama="drama" />
    </div>

    <div v-else-if="query.length >= 2 && !results.length" class="text-center py-12 text-text-muted">
      {{ t('search.noResults', { query }) }}
    </div>
  </div>
</template>
