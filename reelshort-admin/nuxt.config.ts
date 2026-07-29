// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  supabase: {
    redirect: true,
    redirectOptions: { login: '/login', callback: '/confirm' },
  },

  runtimeConfig: {
    supabaseServiceKey: '',
    cloudflareStreamToken: '',
    cloudflareAccountId: '',
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      siteUrl: 'http://localhost:3001',
    },
  },

  routeRules: {
    '/login': { ssr: false },
    '/**': { ssr: false },
  },

  app: {
    head: {
      title: 'ReelShort Admin',
      meta: [
        { name: 'description', content: 'ReelShort Admin Dashboard' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
