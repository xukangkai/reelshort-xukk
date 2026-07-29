<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('ReelShort App Launch')
})

onShow(() => {
  console.log('ReelShort App Show')
})

onHide(() => {
  console.log('ReelShort App Hide')
})
</script>

<style>
/* Global styles */
page {
  background-color: #030712;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Safe area */
.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Scrollbar hide */
.scroll-hidden::-webkit-scrollbar {
  display: none;
}
.scroll-hidden {
  scrollbar-width: none;
}

/* Text utilities */
.text-brand {
  color: #f97316;
}
.bg-brand {
  background-color: #f97316;
}
.bg-brand-dark {
  background-color: #ea580c;
}
.text-muted {
  color: #6b7280;
}
.text-secondary {
  color: #9ca3af;
}
.bg-surface {
  background-color: #1f2937;
}
.bg-surface-light {
  background-color: #111827;
}
.bg-surface-lighter {
  background-color: #374151;
}

/* Skeleton animation */
.skeleton {
  background-color: #1f2937;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
