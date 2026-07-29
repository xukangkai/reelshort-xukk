// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
  ],

  devtools: { enabled: true },

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', name: '中文', file: 'zh.json' },
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: '.',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      fallbackLocale: 'en',
    },
  },

  css: ['~/assets/css/main.css'],

  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
    },
  },

  runtimeConfig: {
    supabaseServiceKey: '',
    cloudflareStreamToken: '',
    cloudflareAccountId: '',
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      siteUrl: 'http://localhost:3000',
      cloudflareStreamBaseUrl: '',
    },
  },

  routeRules: {
    '/': { ssr: true },
    '/movie/**': { ssr: true },
    '/category/**': { ssr: true },
    '/fandom/**': { ssr: true },
    '/search': { ssr: false },
    '/my-list': { ssr: false },
    '/profile': { ssr: false },
  },

  app: {
    head: {
      title: 'ReelShort - Every Second Is Drama',
      meta: [
        { name: 'description', content: 'Watch thousands of short dramas anytime, anywhere. New episodes daily.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})
