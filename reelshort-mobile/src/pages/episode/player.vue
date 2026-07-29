<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import supabase from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatDuration } from '@/utils/format'

const authStore = useAuthStore()

const slug = ref('')
const episodeNumber = ref(1)
const drama = ref<any>(null)
const episodes = ref<any[]>([])
const currentEpisode = ref<any>(null)
const loading = ref(true)

// Player state
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const showControls = ref(true)
const autoPlayNext = ref(true)
const countdown = ref(-1)

let controlsTimer: ReturnType<typeof setTimeout> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null
let countdownTimer: ReturnType<typeof setInterval> | null = null

const totalEpisodes = computed(() => episodes.value.length)

const nextEpisode = computed(() => {
  if (episodeNumber.value < totalEpisodes.value) return episodeNumber.value + 1
  return null
})

const prevEpisode = computed(() => {
  if (episodeNumber.value > 1) return episodeNumber.value - 1
  return null
})

onMounted(async () => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const opts = page?.$page?.options || page?.options || {}
  slug.value = opts.slug || ''
  episodeNumber.value = Number(opts.ep) || 1

  if (slug.value) {
    await fetchData()
    showControlsTemporarily()
    startProgressSaver()
  }
})

onBeforeUnmount(() => {
  if (controlsTimer) clearTimeout(controlsTimer)
  if (progressTimer) clearInterval(progressTimer)
  if (countdownTimer) clearInterval(countdownTimer)
})

async function fetchData() {
  loading.value = true
  const { data: d } = await supabase
    .from('dramas')
    .select('*, episodes(*)')
    .eq('slug', slug.value)
    .eq('status', 'published')
    .single()

  if (!d) {
    uni.showToast({ title: 'Not found', icon: 'none' })
    loading.value = false
    return
  }
  drama.value = d
  episodes.value = (d as any).episodes || []
  currentEpisode.value = episodes.value.find((ep: any) => ep.episode_number === episodeNumber.value) || episodes.value[0]
  loading.value = false
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

function showControlsTemporarily() {
  showControls.value = true
  if (controlsTimer) clearTimeout(controlsTimer)
  controlsTimer = setTimeout(() => {
    if (isPlaying.value) showControls.value = false
  }, 3000)
}

function goBack() {
  uni.navigateBack()
}

function goEpisode(num: number) {
  episodeNumber.value = num
  currentEpisode.value = episodes.value.find((ep: any) => ep.episode_number === num)
  isPlaying.value = false
  currentTime.value = 0
  countdown.value = -1
  if (countdownTimer) clearInterval(countdownTimer)
}

function onVideoEnded() {
  isPlaying.value = false
  if (nextEpisode.value && autoPlayNext.value) {
    countdown.value = 5
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer)
        goEpisode(nextEpisode.value!)
      }
    }, 1000)
  }
}

function cancelAutoPlay() {
  if (countdownTimer) clearInterval(countdownTimer)
  countdown.value = -1
}

async function saveProgress() {
  if (!authStore.user || !currentEpisode.value) return
  await supabase.from('watch_progress').upsert({
    user_id: authStore.user.id,
    episode_id: currentEpisode.value.id,
    drama_id: drama.value!.id,
    progress_seconds: Math.floor(currentTime.value),
    completed: currentTime.value > (duration.value || 1) * 0.9,
  }, { onConflict: 'user_id,episode_id' })
}

function startProgressSaver() {
  progressTimer = setInterval(saveProgress, 30000)
}
</script>

<template>
  <view class="page-player">
    <!-- Video Area -->
    <view class="video-wrap" @tap="showControlsTemporarily">
      <!-- Video -->
      <video
        v-if="currentEpisode?.video_url"
        :id="`video-${currentEpisode.id}`"
        :src="currentEpisode.video_url"
        :poster="currentEpisode.thumbnail_url || drama?.cover_url || ''"
        class="video-element"
        :autoplay="true"
        :controls="false"
        :show-fullscreen-btn="true"
        :show-play-btn="true"
        :enable-progress-gesture="true"
        object-fit="contain"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @timeupdate="currentTime = $event.detail.currentTime; duration = $event.detail.duration"
        @ended="onVideoEnded"
      />

      <!-- No video fallback -->
      <view v-else class="no-video">
        <text class="no-video-icon">🎬</text>
        <text class="no-video-text">Episode {{ episodeNumber }}</text>
        <text class="no-video-sub">Video coming soon</text>
      </view>

      <!-- Top overlay -->
      <view v-show="showControls" class="top-overlay">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="title-area">
          <text class="drama-title">{{ drama?.title }}</text>
          <text class="ep-label">EP{{ episodeNumber }}</text>
        </view>
      </view>

      <!-- Auto-play countdown -->
      <view v-if="countdown > 0 && countdown <= 5" class="countdown-overlay" @tap.stop>
        <text class="countdown-text">Next episode in {{ countdown }}s</text>
        <view class="countdown-btns">
          <view class="btn-play-now" @tap="goEpisode(nextEpisode!)">
            <text class="btn-text">Play Now</text>
          </view>
          <view class="btn-cancel" @tap="cancelAutoPlay">
            <text class="btn-cancel-text">Cancel</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Info Below Video -->
    <scroll-view scroll-y class="info-scroll">
      <view class="info-content">
        <!-- Episode Title -->
        <view class="ep-info">
          <text class="ep-title">{{ drama?.title }}</text>
          <text class="ep-subtitle">Episode {{ episodeNumber }} {{ currentEpisode?.title ? `- ${currentEpisode.title}` : '' }}</text>
        </view>

        <!-- Navigation -->
        <view class="nav-btns">
          <view v-if="prevEpisode" class="nav-btn" @tap="goEpisode(prevEpisode)">
            <text class="nav-btn-text">← Prev</text>
          </view>
          <view v-if="nextEpisode" class="nav-btn nav-btn-primary" @tap="goEpisode(nextEpisode)">
            <text class="nav-btn-text-primary">Next →</text>
          </view>
        </view>

        <!-- Auto-play toggle -->
        <view class="autoplay-row">
          <text class="autoplay-label">Auto-play next</text>
          <switch :checked="autoPlayNext" @change="autoPlayNext = $event.detail.value" color="#f97316" />
        </view>

        <!-- All Episodes -->
        <view class="all-episodes">
          <text class="all-ep-title">All Episodes ({{ totalEpisodes }})</text>
          <view class="ep-grid">
            <view
              v-for="ep in episodes"
              :key="ep.id"
              class="ep-grid-item"
              :class="{ 'ep-grid-active': ep.episode_number === episodeNumber }"
              @tap="goEpisode(ep.episode_number)"
            >
              <text class="ep-grid-number">{{ ep.episode_number }}</text>
              <view v-if="!ep.is_free" class="ep-grid-lock">
                <text class="ep-lock-icon">🔒</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-player {
  min-height: 100vh;
  background-color: #030712;
  display: flex;
  flex-direction: column;
}
.video-wrap {
  position: relative;
  width: 100%;
  height: 440rpx;
  background-color: #000000;
}
.video-element {
  width: 100%;
  height: 100%;
}
.no-video {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.no-video-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}
.no-video-text {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}
.no-video-sub {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 8rpx;
}
.top-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 40rpx 24rpx 24rpx;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.back-btn {
  padding: 12rpx;
}
.back-icon {
  font-size: 36rpx;
  color: #ffffff;
}
.title-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.drama-title {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.ep-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 16rpx;
}
.countdown-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.countdown-text {
  font-size: 32rpx;
  color: #ffffff;
  margin-bottom: 32rpx;
}
.countdown-btns {
  display: flex;
  gap: 24rpx;
}
.btn-play-now {
  padding: 20rpx 40rpx;
  background-color: #f97316;
  border-radius: 12rpx;
}
.btn-text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
}
.btn-cancel {
  padding: 20rpx 40rpx;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
}
.btn-cancel-text {
  color: #ffffff;
  font-size: 28rpx;
}
.info-scroll {
  flex: 1;
  background-color: #030712;
}
.info-content {
  padding: 32rpx;
}
.ep-info {
  margin-bottom: 24rpx;
}
.ep-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
}
.ep-subtitle {
  font-size: 26rpx;
  color: #6b7280;
  margin-top: 8rpx;
}
.nav-btns {
  display: flex;
  gap: 20rpx;
  margin-bottom: 24rpx;
}
.nav-btn {
  padding: 16rpx 28rpx;
  background-color: #1f2937;
  border-radius: 12rpx;
}
.nav-btn-primary {
  background-color: #f97316;
}
.nav-btn-text {
  font-size: 26rpx;
  color: #ffffff;
}
.nav-btn-text-primary {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 500;
}
.autoplay-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
  padding: 16rpx 0;
}
.autoplay-label {
  font-size: 28rpx;
  color: #9ca3af;
}
.all-episodes {
  margin-top: 16rpx;
}
.all-ep-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20rpx;
}
.ep-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16rpx;
}
.ep-grid-item {
  position: relative;
  aspect-ratio: 16/9;
  background-color: #111827;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid transparent;
}
.ep-grid-active {
  border-color: #f97316;
  background-color: rgba(249, 115, 22, 0.1);
}
.ep-grid-number {
  font-size: 26rpx;
  font-weight: 500;
  color: #ffffff;
}
.ep-grid-lock {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ep-lock-icon {
  font-size: 18rpx;
}
.safe-bottom {
  height: 120rpx;
}
</style>
