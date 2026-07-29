<script setup lang="ts">
const { t, locale, setLocale } = useI18n()
const user = useSupabaseUser()
const loggedIn = computed(() => !!user.value)
const route = useRoute()

const navItems = computed(() => [
  { label: t('nav.home'), path: '/' },
  { label: t('nav.categories'), path: '/category' },
  { label: t('nav.fandom'), path: '/fandom' },
])

const toggleLocale = () => {
  setLocale(locale.value === 'en' ? 'zh' : 'en')
}

const isSearchOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
        <span class="text-2xl font-bold text-brand">ReelShort</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-6 ml-8">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="text-sm font-medium transition-colors hover:text-brand"
          :class="route.path === item.path ? 'text-brand' : 'text-text-secondary'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <!-- Language Toggle -->
        <button
          @click="toggleLocale"
          class="p-2 rounded-lg hover:bg-surface-light transition-colors text-text-secondary hover:text-white"
          :title="t('nav.language')"
        >
          <span class="text-xs font-bold">{{ locale === 'en' ? 'EN' : '中文' }}</span>
        </button>
        <!-- Search -->
        <button
          @click="$router.push('/search')"
          class="p-2 rounded-lg hover:bg-surface-light transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <!-- User menu -->
        <template v-if="loggedIn">
          <NuxtLink
            to="/profile"
            class="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-sm font-bold"
          >
            U
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="hidden md:inline-flex px-4 py-2 bg-brand hover:bg-brand-dark rounded-lg text-sm font-medium transition-colors"
          >
            {{ t('nav.signIn') }}
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>
