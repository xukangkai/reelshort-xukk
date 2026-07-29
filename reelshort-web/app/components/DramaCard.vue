<script setup lang="ts">
import type { Drama } from '@reelshort/shared'

const props = defineProps<{ drama: Drama }>()
</script>

<template>
  <NuxtLink :to="`/movie/${drama.slug}`" class="drama-card block group">
    <!-- Poster -->
    <div class="aspect-[3/4] bg-surface-light rounded-lg overflow-hidden">
      <img
        v-if="drama.poster_url"
        :src="drama.poster_url"
        :alt="drama.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-text-muted text-sm">
        {{ drama.title }}
      </div>
    </div>

    <!-- Overlay on hover -->
    <div class="drama-card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 rounded-lg flex flex-col justify-end p-3">
      <span class="text-xs text-brand font-medium">{{ drama.age_rating }}</span>
    </div>

    <!-- Info -->
    <div class="mt-2 px-0.5">
      <h3 class="text-sm font-medium truncate">{{ drama.title }}</h3>
      <div class="flex items-center gap-2 mt-0.5 text-text-muted text-xs">
        <span>{{ formatNumber(drama.views_count) }} views</span>
        <span v-if="drama.rating">⭐ {{ drama.rating }}</span>
      </div>
    </div>

    <!-- Badges -->
    <div class="absolute top-2 left-2 flex gap-1">
      <span v-if="drama.is_featured" class="px-1.5 py-0.5 bg-brand text-[10px] font-bold rounded">HOT</span>
      <span v-if="drama.age_rating !== 'All'" class="px-1.5 py-0.5 bg-black/60 text-[10px] font-bold rounded">{{ drama.age_rating }}</span>
    </div>
  </NuxtLink>
</template>
