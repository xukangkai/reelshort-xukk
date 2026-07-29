import type { Config } from 'tailwindcss'

export default {
  content: ['./app/components/**/*.vue', './app/layouts/**/*.vue', './app/pages/**/*.vue', './app/app.vue'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#e94560', dark: '#c73550' },
        bg: '#f8fafc',
        sidebar: { DEFAULT: '#1e293b', hover: '#334155', active: '#0f172a' },
        surface: { DEFAULT: '#ffffff', light: '#f1f5f9', dark: '#e2e8f0' },
        text: { DEFAULT: '#1e293b', secondary: '#64748b', muted: '#94a3b8' },
        border: '#e2e8f0',
        danger: '#ef4444',
      },
    },
  },
} satisfies Config
