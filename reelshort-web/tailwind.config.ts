import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.ts',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#e94560',
          dark: '#c73550',
          light: '#ff6b81',
        },
        gold: '#ffd700',
        bg: '#030712',
        surface: {
          DEFAULT: '#1a1a2e',
          light: '#242445',
          lighter: '#2e2e5a',
        },
        text: {
          DEFAULT: '#f9fafb',
          secondary: '#9ca3af',
          muted: '#6b7280',
        },
        border: '#374151',
      },
    },
  },
} satisfies Config
