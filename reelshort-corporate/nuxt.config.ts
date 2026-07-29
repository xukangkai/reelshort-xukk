// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  ssr: true,

  nitro: {
    prerender: {
      routes: ['/', '/fandom', '/about', '/press', '/contact', '/privacy', '/terms', '/download'],
      crawlLinks: true,
    },
  },

  app: {
    head: {
      title: 'ReelShort - Every Second Is Drama',
      meta: [
        { name: 'description', content: 'ReelShort is the leading short drama streaming platform.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
})
