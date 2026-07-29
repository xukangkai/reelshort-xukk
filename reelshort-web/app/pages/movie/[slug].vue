<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const slug = route.params.slug as string
const { data: drama, pending, error } = await useDramaDetail(slug)

if (error.value || !drama.value) {
  throw createError({ statusCode: 404, message: 'Drama not found' })
}

useHead({
  title: `${drama.value.title} - ReelShort`,
  meta: [
    { name: 'description', content: drama.value.description || '' },
    { property: 'og:title', content: drama.value.title },
    { property: 'og:description', content: drama.value.description || '' },
    { property: 'og:image', content: drama.value.poster_url || '' },
  ],
})

const isExpanded = ref(false)
const episodeGroups = computed(() => {
  if (!drama.value?.episodes) return []
  const eps = drama.value.episodes
  const groups: { label: string; episodes: typeof eps }[] = []
  const CHUNK = 50
  for (let i = 0; i < eps.length; i += CHUNK) {
    const chunk = eps.slice(i, i + CHUNK)
    groups.push({
      label: `EP ${chunk[0].episode_number}-${chunk[chunk.length - 1].episode_number}`,
      episodes: chunk,
    })
  }
  return groups
})
const activeGroup = ref(0)
</script>

<template>
  <div v-if="drama" class="pb-20 lg:pb-8">
    <!-- Hero Cover -->
    <div class="relative aspect-[16/9] md:aspect-[16/7] lg:aspect-[16/5]">
      <img :src="drama.cover_url || drama.poster_url || ''" :alt="drama.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 gradient-bottom" />
    </div>

    <!-- Info Section -->
    <div class="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
      <div class="flex gap-6">
        <!-- Poster (desktop) -->
        <div class="hidden md:block w-48 lg:w-56 shrink-0">
          <img :src="drama.poster_url || ''" :alt="drama.title" class="w-full aspect-[3/4] object-cover rounded-xl shadow-xl" />
        </div>

        <!-- Details -->
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl md:text-3xl font-bold">{{ drama.title }}</h1>

          <div class="flex items-center gap-4 mt-3 text-text-secondary text-sm">
            <span>{{ formatNumber(drama.views_count) }} {{ t('movie.views') }}</span>
            <span>{{ formatNumber(drama.likes_count) }} {{ t('movie.likes') }}</span>
            <span v-if="drama.rating">⭐ {{ drama.rating }}</span>
            <span class="px-2 py-0.5 border border-text-muted rounded text-xs">{{ drama.age_rating }}</span>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-3 mt-4">
            <NuxtLink
              v-if="drama.episodes?.length"
              :to="`/episode/${drama.slug}/${drama.episodes[0].episode_number}`"
              class="px-6 py-2.5 bg-brand hover:bg-brand-dark rounded-lg font-medium transition-colors"
            >
              {{ t('movie.goWatching') }}
            </NuxtLink>
            <button class="px-4 py-2.5 bg-surface-light hover:bg-surface-lighter rounded-lg text-sm transition-colors">
              {{ t('movie.addToList') }}
            </button>
          </div>

          <!-- Description -->
          <div v-if="drama.description" class="mt-4">
            <p class="text-text-secondary text-sm leading-relaxed" :class="!isExpanded && 'line-clamp-3'">
              {{ drama.description }}
            </p>
            <button @click="isExpanded = !isExpanded" class="text-brand text-sm mt-1">
              {{ isExpanded ? t('movie.showLess') : t('movie.more') }}
            </button>
          </div>

          <!-- Tags -->
          <div v-if="(drama as any).drama_tags?.length" class="flex flex-wrap gap-2 mt-3">
            <span
              v-for="dt in (drama as any).drama_tags"
              :key="dt.tag_id"
              class="px-2 py-1 bg-surface-lighter rounded text-xs text-text-secondary"
            >
              {{ dt.tags?.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Episodes Section -->
      <div class="mt-8">
        <h2 class="text-lg font-bold mb-4">{{ t('movie.episodes') }} ({{ drama.total_episodes }})</h2>

        <!-- Episode groups tabs -->
        <div v-if="episodeGroups.length > 1" class="flex gap-2 mb-4 overflow-x-auto">
          <button
            v-for="(group, i) in episodeGroups"
            :key="i"
            @click="activeGroup = i"
            class="px-4 py-1.5 rounded-full text-sm shrink-0 transition-colors"
            :class="activeGroup === i ? 'bg-brand text-white' : 'bg-surface-light text-text-secondary hover:bg-surface-lighter'"
          >
            {{ group.label }}
          </button>
        </div>

        <!-- Episode grid -->
        <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          <NuxtLink
            v-for="ep in episodeGroups[activeGroup]?.episodes || []"
            :key="ep.id"
            :to="`/episode/${drama.slug}/${ep.episode_number}`"
            class="relative aspect-video bg-surface-light rounded flex items-center justify-center hover:bg-surface-lighter transition-colors group"
          >
            <span class="text-sm font-medium">{{ ep.episode_number }}</span>
            <div v-if="!ep.is_free" class="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-black/60 rounded-sm flex items-center justify-center">
              <svg class="w-2 h-2 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div v-else-if="pending" class="max-w-7xl mx-auto px-4 py-8">
    <div class="skeleton h-64 w-full mb-6" />
    <div class="skeleton h-8 w-48 mb-4" />
    <div class="skeleton h-4 w-full mb-2" />
    <div class="skeleton h-4 w-3/4" />
  </div>
</template>
