<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const dramaSlug = route.params.dramaSlug as string
const episodeNumber = Number(route.params.episodeNumber)

// Fetch drama + episode data
const { data: drama } = await useAsyncData(`play-${dramaSlug}`, async () => {
  const { data: d, error } = await supabase
    .from('dramas')
    .select('*, episodes(*)')
    .eq('slug', dramaSlug)
    .eq('status', 'published')
    .single()
  if (error) throw createError({ statusCode: 404, message: 'Drama not found' })
  return d
})

const currentEpisode = computed(() => {
  const eps = (drama.value as any)?.episodes || []
  return eps.find((ep: any) => ep.episode_number === episodeNumber) || eps[0]
})

// VIP access control
const { isVip, checkVip, canWatchEpisode } = useVip()
await checkVip()

const accessResult = computed(() => canWatchEpisode(currentEpisode.value))
const isLocked = computed(() => accessResult.value !== true)
const showPaywall = ref(false)
const showLoginPrompt = computed(() => accessResult.value === 'login')

// If episode is locked, check access
watch([currentEpisode, () => user.value], () => {
  if (currentEpisode.value && !currentEpisode.value.is_free) {
    if (!user.value) return // show login prompt
    if (!isVip.value) showPaywall.value = true
  }
}, { immediate: true })

const totalEpisodes = computed(() => (drama.value as any)?.episodes?.length || 0)

const nextEpisode = computed(() => {
  if (episodeNumber < totalEpisodes.value) return episodeNumber + 1
  return null
})

const prevEpisode = computed(() => {
  if (episodeNumber > 1) return episodeNumber - 1
  return null
})

useHead({
  title: `${drama.value?.title} EP${episodeNumber} - ReelShort`,
  meta: [
    { name: 'description', content: currentEpisode.value?.description || `Watch ${drama.value?.title} Episode ${episodeNumber}` },
  ],
})

// Player state
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isFullscreen = ref(false)
const showControls = ref(true)
let hideTimer: ReturnType<typeof setTimeout>

const videoRef = ref<HTMLVideoElement | null>(null)
const playerContainerRef = ref<HTMLElement | null>(null)

const togglePlay = () => {
  if (!videoRef.value || isLocked.value) return
  if (isPlaying.value) videoRef.value.pause()
  else videoRef.value.play()
  isPlaying.value = !isPlaying.value
}

const seek = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (videoRef.value) videoRef.value.currentTime = Number(target.value)
}

const setVolume = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (videoRef.value) {
    videoRef.value.volume = Number(target.value)
    volume.value = Number(target.value)
  }
}

const toggleFullscreen = async () => {
  if (!playerContainerRef.value) return
  if (isFullscreen.value) {
    await document.exitFullscreen()
  } else {
    await playerContainerRef.value.requestFullscreen()
  }
  isFullscreen.value = !isFullscreen.value
}

const showControlsTemporarily = () => {
  showControls.value = true
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (isPlaying.value) showControls.value = false
  }, 3000)
}

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case ' ':
      e.preventDefault()
      togglePlay()
      break
    case 'ArrowRight':
      if (videoRef.value) videoRef.value.currentTime += 5
      break
    case 'ArrowLeft':
      if (videoRef.value) videoRef.value.currentTime -= 5
      break
    case 'f':
    case 'F':
      toggleFullscreen()
      break
    case 'n':
    case 'N':
      if (nextEpisode.value) navigateTo(`/episode/${dramaSlug}/${nextEpisode.value}`)
      break
    case 'p':
    case 'P':
      if (prevEpisode.value) navigateTo(`/episode/${dramaSlug}/${prevEpisode.value}`)
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  showControlsTemporarily()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  clearTimeout(hideTimer)
})

// Save watch progress
const saveProgress = async () => {
  if (!user.value || !currentEpisode.value) return
  await supabase.from('watch_progress').upsert({
    user_id: user.value.id,
    episode_id: currentEpisode.value.id,
    drama_id: drama.value!.id,
    progress_seconds: Math.floor(currentTime.value),
    completed: currentTime.value > (duration.value || 1) * 0.9,
  }, { onConflict: 'user_id,episode_id' })
}

// Save every 30s
let progressInterval: ReturnType<typeof setInterval>
onMounted(() => {
  progressInterval = setInterval(saveProgress, 30000)
})
onBeforeUnmount(() => {
  clearInterval(progressInterval)
  saveProgress()
})

const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

// Auto-play next episode
const autoPlayNext = ref(true)
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval>

const onVideoEnded = () => {
  isPlaying.value = false
  if (currentTime.value < 3) return // 防止误触发
  if (nextEpisode.value && autoPlayNext.value) {
    countdown.value = 5
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer)
        navigateTo(`/episode/${dramaSlug}/${nextEpisode.value}`)
      }
    }, 1000)
  }
}

const cancelAutoPlay = () => {
  clearInterval(countdownTimer)
  countdown.value = -1
}

// Like
const isLiked = ref(false)
const handleLike = async () => {
  isLiked.value = !isLiked.value
  if (drama.value) {
    const newCount = isLiked.value ? (drama.value.likes_count || 0) + 1 : Math.max((drama.value.likes_count || 0) - 1, 0)
    await supabase.from('dramas').update({ likes_count: newCount }).eq('id', drama.value.id)
    drama.value.likes_count = newCount
  }
}

// Share
const showShareTip = ref(false)
const handleShare = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    showShareTip.value = true
    setTimeout(() => { showShareTip.value = false }, 2000)
  } catch {
    // fallback
    showShareTip.value = true
    setTimeout(() => { showShareTip.value = false }, 2000)
  }
}
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Video Player -->
    <div
      ref="playerContainerRef"
      class="relative w-full aspect-video max-h-[80vh] mx-auto bg-black group cursor-pointer"
      @mousemove="showControlsTemporarily"
      @click="togglePlay"
    >
      <video
        ref="videoRef"
        class="w-full h-full object-contain"
        :src="currentEpisode?.video_url || ''"
        :poster="currentEpisode?.thumbnail_url || drama?.cover_url || ''"
        @timeupdate="currentTime = ($event.target as HTMLVideoElement).currentTime; duration = ($event.target as HTMLVideoElement).duration"
        @ended="onVideoEnded"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        playsinline
        autoplay
        preload="auto"
      />

      <!-- Controls Overlay -->
      <div
        v-show="showControls"
        class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity"
      >
        <!-- Top bar -->
        <div class="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <NuxtLink :to="`/movie/${dramaSlug}`" class="flex items-center gap-2 text-white hover:text-brand">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            <span class="text-sm font-medium">{{ drama?.title }}</span>
          </NuxtLink>
          <span class="text-sm text-white/70">EP{{ episodeNumber }}</span>
        </div>

        <!-- Play icon center -->
        <div v-if="!isPlaying" class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-brand/90 flex items-center justify-center">
            <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>

        <!-- Bottom controls -->
        <div class="p-4 space-y-2" @click.stop>
          <!-- Progress bar -->
          <input
            type="range"
            min="0"
            :max="duration || 0"
            :value="currentTime"
            @input="seek"
            class="w-full h-1 appearance-none bg-white/30 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand"
          />

          <div class="flex items-center justify-between text-white text-sm">
            <div class="flex items-center gap-4">
              <!-- Play/Pause -->
              <button @click="togglePlay" class="hover:text-brand">
                <svg v-if="isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </button>

              <!-- Prev/Next -->
              <button v-if="prevEpisode" @click="navigateTo(`/episode/${dramaSlug}/${prevEpisode}`)" class="hover:text-brand">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>
              <button v-if="nextEpisode" @click="navigateTo(`/episode/${dramaSlug}/${nextEpisode}`)" class="hover:text-brand">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
              </button>

              <!-- Volume -->
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                <input
                  type="range" min="0" max="1" step="0.1" :value="volume"
                  @input="setVolume"
                  class="w-20 h-1 appearance-none bg-white/30 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>

              <!-- Time -->
              <span class="text-xs text-white/70">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
            </div>

            <!-- Fullscreen -->
            <button @click="toggleFullscreen" class="hover:text-brand">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Auto-play countdown -->
      <div v-if="countdown > 0 && countdown <= 5" class="absolute inset-0 flex items-center justify-center bg-black/70" @click.stop>
        <div class="text-center text-white">
          <p class="text-lg mb-4">{{ t('episode.nextEpisodeIn', { count: countdown }) }}</p>
          <div class="flex gap-3 justify-center">
            <button @click="navigateTo(`/episode/${dramaSlug}/${nextEpisode}`)" class="px-5 py-2 bg-brand hover:bg-brand-dark rounded-lg font-medium">{{ t('episode.playNow') }}</button>
            <button @click="cancelAutoPlay" class="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium">{{ t('episode.cancel') }}</button>
          </div>
        </div>
      </div>

      <!-- No video fallback -->
      <div v-if="!currentEpisode?.video_url" class="absolute inset-0 flex items-center justify-center" @click.stop>
        <div class="text-center text-white/60">
          <svg class="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          <p class="text-lg font-medium">{{ t('episode.episode', { number: episodeNumber }) }}</p>
          <p class="text-sm">{{ t('episode.videoComingSoon') }}</p>
        </div>
      </div>

      <!-- Lock Overlay (VIP required) -->
      <div v-if="isLocked" class="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10" @click.stop>
        <div class="text-center">
          <!-- Login required -->
          <template v-if="showLoginPrompt">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-brand/20 flex items-center justify-center">
              <svg class="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <p class="text-white text-lg font-bold mb-2">Login Required</p>
            <p class="text-gray-400 text-sm mb-4">Sign in to watch this episode</p>
            <NuxtLink to="/login" class="px-6 py-2.5 bg-brand hover:bg-brand-dark rounded-lg font-medium text-white transition-colors">Sign In</NuxtLink>
          </template>
          <!-- VIP required -->
          <template v-else>
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/></svg>
            </div>
            <p class="text-white text-lg font-bold mb-2">VIP Episode</p>
            <p class="text-gray-400 text-sm mb-4">Subscribe to VIP to unlock all episodes</p>
            <button @click="showPaywall = true" class="px-6 py-2.5 bg-gradient-to-r from-brand to-orange-500 hover:opacity-90 rounded-lg font-bold text-white transition-all">Upgrade to VIP</button>
          </template>
        </div>
      </div>
    </div>

    <!-- Episode Info & Navigation -->
    <div class="max-w-7xl mx-auto px-4 py-6 bg-gray-950">
      <!-- Episode title -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-xl font-bold">{{ drama?.title }}</h1>
          <p class="text-text-muted text-sm">{{ t('episode.episode', { number: episodeNumber }) }} {{ currentEpisode?.title ? `- ${currentEpisode.title}` : '' }}</p>
        </div>
        <div class="flex gap-2">
          <NuxtLink
            v-if="prevEpisode"
            :to="`/episode/${dramaSlug}/${prevEpisode}`"
            class="px-3 py-1.5 bg-surface-light hover:bg-surface-lighter rounded-lg text-sm transition-colors"
          >
            {{ t('episode.prev') }}
          </NuxtLink>
          <NuxtLink
            v-if="nextEpisode"
            :to="`/episode/${dramaSlug}/${nextEpisode}`"
            class="px-3 py-1.5 bg-brand hover:bg-brand-dark rounded-lg text-sm transition-colors"
          >
            {{ t('episode.next') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Action bar -->
      <div class="flex items-center gap-4 mb-6">
        <button @click="handleLike" class="flex items-center gap-1.5 text-sm transition-colors" :class="isLiked ? 'text-brand' : 'text-text-secondary hover:text-brand'">
          <svg class="w-5 h-5" :fill="isLiked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          {{ formatNumber(drama?.likes_count || 0) }}
        </button>
        <button @click="handleShare" class="relative flex items-center gap-1.5 text-text-secondary hover:text-brand text-sm transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          {{ t('episode.share') }}
          <span v-if="showShareTip" class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-xs rounded whitespace-nowrap">Link copied!</span>
        </button>
        <label class="flex items-center gap-1.5 text-text-secondary text-sm ml-auto">
          <input v-model="autoPlayNext" type="checkbox" class="accent-brand" />
          {{ t('episode.autoPlayNext') }}
        </label>
      </div>

      <!-- Episode Grid -->
      <div>
        <h3 class="font-semibold mb-3">{{ t('episode.allEpisodes') }} ({{ totalEpisodes }})</h3>
        <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          <NuxtLink
            v-for="ep in [...((drama as any)?.episodes || [])].sort((a: any, b: any) => a.episode_number - b.episode_number)"
            :key="ep.id"
            :to="`/episode/${dramaSlug}/${ep.episode_number}`"
            class="relative aspect-video bg-surface-light rounded flex items-center justify-center hover:bg-surface-lighter transition-colors"
            :class="ep.episode_number === episodeNumber && 'ring-2 ring-brand'"
          >
            <span class="text-sm font-medium">{{ ep.episode_number }}</span>
            <div v-if="!ep.is_free" class="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-black/60 rounded-sm flex items-center justify-center">
              <svg class="w-2 h-2 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" /></svg>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <!-- Paywall Modal -->
  <PaywallModal
    :visible="showPaywall"
    :episode-number="episodeNumber"
    :drama-title="drama?.title || ''"
    @close="showPaywall = false; checkVip()"
  />
</template>
