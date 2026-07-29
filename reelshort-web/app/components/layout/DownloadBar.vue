<script setup lang="ts">
const { t } = useI18n()
const isVisible = ref(true)

const dismiss = () => {
  isVisible.value = false
  localStorage.setItem('download_bar_dismissed', 'true')
}

onMounted(() => {
  if (localStorage.getItem('download_bar_dismissed')) {
    isVisible.value = false
  }
})
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="isVisible"
      class="fixed bottom-14 lg:bottom-0 left-0 right-0 z-40 bg-surface-light border-t border-border px-4 py-2.5 flex items-center justify-between gap-3"
    >
      <div class="flex items-center gap-3 min-w-0">
        <span class="text-brand font-bold text-lg shrink-0">ReelShort</span>
        <p class="text-text-secondary text-sm truncate">{{ t('download.text') }}</p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <a href="#" class="px-3 py-1.5 bg-brand hover:bg-brand-dark rounded text-xs font-medium transition-colors">
          {{ t('download.getApp') }}
        </a>
        <button @click="dismiss" class="p-1 text-text-muted hover:text-text">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
