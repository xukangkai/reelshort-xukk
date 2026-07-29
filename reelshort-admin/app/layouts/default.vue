<script setup lang="ts">
const route = useRoute()
const user = useSupabaseUser()
const loggedIn = computed(() => !!user.value)

const navItems = [
  { label: '仪表盘', path: '/', icon: 'chart' },
  { label: '剧集管理', path: '/dramas', icon: 'film' },
  { label: '单集管理', path: '/episodes', icon: 'play' },
  { label: '分类管理', path: '/categories', icon: 'folder' },
  { label: '标签管理', path: '/tags', icon: 'tag' },
  { label: '货架管理', path: '/shelves', icon: 'shelf' },
  { label: '轮播Banner', path: '/banners', icon: 'image' },
  { label: '用户管理', path: '/users', icon: 'users' },
  { label: '订单管理', path: '/orders', icon: 'receipt' },
  { label: 'VIP套餐', path: '/vip-plans', icon: 'star' },
  { label: '系统设置', path: '/settings', icon: 'cog' },
]
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-60 bg-sidebar text-white flex flex-col shrink-0 hidden lg:flex">
      <div class="h-14 flex items-center px-5 border-b border-white/10">
        <span class="text-lg font-bold text-brand">ReelShort</span>
        <span class="ml-2 text-xs text-text-muted">管理后台</span>
      </div>
      <nav class="flex-1 py-4 overflow-y-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-5 py-2.5 text-sm transition-colors"
          :class="route.path === item.path ? 'bg-sidebar-active text-white' : 'text-slate-300 hover:bg-sidebar-hover'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="h-14 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
        <h2 class="font-semibold text-text-secondary">{{ navItems.find(n => n.path === route.path)?.label || 'Admin' }}</h2>
        <div class="flex items-center gap-3">
          <NuxtLink v-if="loggedIn" to="/profile" class="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold">A</NuxtLink>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
