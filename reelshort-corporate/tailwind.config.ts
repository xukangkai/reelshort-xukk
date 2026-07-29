import type { Config } from 'tailwindcss'

export default {
  content: ['./app/components/**/*.vue', './app/layouts/**/*.vue', './app/pages/**/*.vue', './app/app.vue'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#e94560', dark: '#c73550' },
        bg: '#030712',
        surface: { DEFAULT: '#1a1a2e' },
        text: { DEFAULT: '#f9fafb', secondary: '#9ca3af', muted: '#6b7280' },
        border: '#374151',
      },
    },
  },
} satisfies Config
