<script setup lang="ts">
import type { Banner } from '@reelshort/shared'

const props = defineProps<{ banners: Banner[] }>()

const currentIndex = ref(0)
let interval: ReturnType<typeof setInterval>

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % Math.max(props.banners.length, 1)
}
const goTo = (i: number) => {
  currentIndex.value = i
}

onMounted(() => {
  interval = setInterval(next, 5000)
})
onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<template>
  <div v-if="banners.length" class="relative w-full aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4] overflow-hidden">
    <TransitionGroup name="banner">
      <div
        v-for="(banner, i) in banners"
        v-show="currentIndex === i"
        :key="banner.id"
        class="absolute inset-0"
      >
        <img
          :src="banner.image_url"
          :alt="banner.title || ''"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 gradient-bottom" />
        <div class="absolute bottom-6 left-6 md:left-12 max-w-lg">
          <h2 class="text-xl md:text-3xl font-bold mb-2">{{ banner.title }}</h2>
          <NuxtLink
            v-if="banner.link_type === 'drama'"
            :to="`/movie/${banner.link_value}`"
            class="inline-flex px-5 py-2.5 bg-brand hover:bg-brand-dark rounded-lg font-medium transition-colors"
          >
            Watch Now
          </NuxtLink>
        </div>
      </div>
    </TransitionGroup>

    <!-- Dots -->
    <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(_, i) in banners"
        :key="i"
        @click="goTo(i)"
        class="w-2 h-2 rounded-full transition-all"
        :class="currentIndex === i ? 'bg-brand w-6' : 'bg-white/40'"
      />
    </div>
  </div>

  <!-- Fallback when no banners -->
  <div v-else class="w-full aspect-[16/6] bg-surface-light flex items-center justify-center">
    <span class="text-2xl font-bold text-brand">ReelShort</span>
  </div>
</template>
