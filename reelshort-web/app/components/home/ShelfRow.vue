<script setup lang="ts">
import type { Drama } from '@reelshort/shared'

defineProps<{
  title: string
  dramas: Drama[]
  slug?: string
}>()
</script>

<template>
  <section v-if="dramas.length">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg md:text-xl font-bold">{{ title }}</h2>
      <NuxtLink v-if="slug" :to="`/shelf/${slug}`" class="text-brand text-sm hover:underline">View All</NuxtLink>
    </div>
    <div class="shelf-scroll">
      <DramaCard
        v-for="drama in dramas"
        :key="drama.id"
        :drama="drama"
        class="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] shrink-0 snap-start"
      />
    </div>
  </section>
</template>
