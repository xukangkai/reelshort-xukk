<script setup lang="ts">
const route = useRoute()
const menuOpen = ref(false)

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Watch', to: '/#watch' },
  { label: 'Fandom', to: '/fandom' },
  { label: 'Company', to: '/about' },
]

watch(() => route.fullPath, () => {
  menuOpen.value = false
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
      <NuxtLink to="/" class="relative z-10">
        <BrandLogo />
      </NuxtLink>

      <nav class="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
        <NuxtLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="text-sm font-semibold text-white/65 transition-colors hover:text-white"
          :class="{ 'text-white': route.path === item.to }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hidden items-center gap-3 md:flex">
        <a
          href="https://www.reelshort.com"
          target="_blank"
          rel="noopener"
          class="icon-button"
          aria-label="Search ReelShort"
          title="Search ReelShort"
        >
          <span aria-hidden="true">⌕</span>
        </a>
        <NuxtLink to="/download" class="button button-primary button-small">
          Get the app
          <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>

      <button
        class="icon-button relative z-10 md:hidden"
        type="button"
        :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <span class="text-xl" aria-hidden="true">{{ menuOpen ? '×' : '☰' }}</span>
      </button>
    </div>

    <Transition name="menu">
      <div v-if="menuOpen" class="border-t border-white/10 bg-black px-4 py-5 md:hidden">
        <nav class="flex flex-col" aria-label="Mobile navigation">
          <NuxtLink
            v-for="item in navItems"
            :key="item.label"
            :to="item.to"
            class="border-b border-white/10 py-4 text-lg font-bold"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
        <NuxtLink to="/download" class="button button-primary mt-5 w-full">
          Get the app
          <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
