<script setup lang="ts">
const { t } = useI18n()

const socials = [
  { name: 'Facebook', url: 'https://facebook.com/reelshort' },
  { name: 'YouTube', url: 'https://youtube.com/@reelshort' },
  { name: 'Instagram', url: 'https://instagram.com/reelshort' },
  { name: 'TikTok', url: 'https://tiktok.com/@reelshort' },
]

const linkColumns = computed(() => [
  {
    title: t('footer.about'),
    links: [
      { label: t('footer.aboutUs'), path: '/about' },
      { label: t('footer.terms'), path: '/terms' },
      { label: t('footer.privacy'), path: '/privacy' },
    ],
  },
  {
    title: t('footer.support'),
    links: [
      { label: t('footer.helpCenter'), path: '/help' },
      { label: t('footer.contactUs'), path: '/contact' },
      { label: t('footer.faq'), path: '/faq' },
    ],
  },
  {
    title: t('footer.followUs'),
    links: [
      { label: 'Facebook', path: 'https://facebook.com/reelshort' },
      { label: 'YouTube', path: 'https://youtube.com/@reelshort' },
      { label: 'Instagram', path: 'https://instagram.com/reelshort' },
    ],
  },
])
</script>

<template>
  <footer class="bg-surface border-t border-border mt-12">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div>
          <h3 class="text-xl font-bold text-brand mb-3">ReelShort</h3>
          <p class="text-text-secondary text-sm">{{ t('footer.slogan') }}</p>
          <!-- Social icons -->
          <div class="flex gap-3 mt-4">
            <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" rel="noopener"
              class="w-9 h-9 rounded-full bg-surface-light flex items-center justify-center hover:bg-brand transition-colors">
              <span class="text-xs font-bold">{{ social.name[0] }}</span>
            </a>
          </div>
        </div>

        <!-- Links columns -->
        <div v-for="col in linkColumns" :key="col.title">
          <h4 class="font-semibold mb-3">{{ col.title }}</h4>
          <ul class="space-y-2">
            <li v-for="link in col.links" :key="link.label">
              <NuxtLink :to="link.path" class="text-text-secondary text-sm hover:text-brand transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-border mt-8 pt-6 text-center text-text-muted text-sm">
        &copy; {{ new Date().getFullYear() }} ReelShort. {{ t('footer.copyright') }}
      </div>
    </div>
  </footer>
</template>
