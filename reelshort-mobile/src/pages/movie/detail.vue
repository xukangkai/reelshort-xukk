<script setup lang="ts">
import { ref, onMounted } from 'vue'
import supabase from '@/utils/supabase'

const slug = ref('')
const drama = ref<any>(null)
const episodes = ref<any[]>([])
const loading = ref(true)
const isExpanded = ref(false)
const activeGroup = ref(0)

const episodeGroups = ref<{ label: string; episodes: any[] }[]>([])

onMounted(async () => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  slug.value = page?.$page?.options?.slug || page?.options?.slug || ''
  if (slug.value) {
    await fetchData()
  }
})

async function fetchData() {
  loading.value = true
  // Fetch drama
  const { data: d, error } = await supabase
    .from('dramas')
    .select('*, drama_categories(*, categories(*)), drama_tags(*, tags(*))')
    .eq('slug', slug.value)
    .eq('status', 'published')
    .single()

  if (error || !d) {
    uni.showToast({ title: 'Drama not found', icon: 'none' })
    loading.value = false
    return
  }
  drama.value = d

  // Fetch episodes
  const { data: eps } = await supabase
    .from('episodes')
    .select('*')
    .eq('drama_id', d.id)
    .order('sort_order')
  episodes.value = eps || []

  // Group episodes
  const CHUNK = 50
  const groups: { label: string; episodes: any[] }[] = []
  for (let i = 0; i < episodes.value.length; i += CHUNK) {
    const chunk = episodes.value.slice(i, i + CHUNK)
    groups.push({
      label: `EP ${chunk[0].episode_number}-${chunk[chunk.length - 1].episode_number}`,
      episodes: chunk,
    })
  }
  episodeGroups.value = groups

  loading.value = false
}

function goPlay(episodeNumber: number) {
  uni.navigateTo({
    url: `/pages/episode/player?slug=${slug.value}&ep=${episodeNumber}`
  })
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toString()
}
</script>

<template>
  <view class="page-movie">
    <!-- Loading -->
    <view v-if="loading" class="loading-wrap">
      <view class="skeleton skeleton-cover" />
      <view class="skeleton skeleton-title" />
      <view class="skeleton skeleton-text" />
    </view>

    <scroll-view v-else-if="drama" scroll-y class="scroll-content">
      <!-- Cover Image -->
      <view class="cover-wrap">
        <image
          :src="drama.cover_url || drama.poster_url || ''"
          mode="aspectFill"
          class="cover-image"
        />
        <view class="cover-gradient" />
      </view>

      <!-- Info Section -->
      <view class="info-section">
        <text class="drama-title">{{ drama.title }}</text>

        <view class="meta-row">
          <text class="meta-item">{{ formatNumber(drama.views_count) }} views</text>
          <text class="meta-item">{{ formatNumber(drama.likes_count) }} likes</text>
          <text v-if="drama.rating" class="meta-item">⭐ {{ drama.rating }}</text>
          <text class="meta-badge">{{ drama.age_rating }}</text>
        </view>

        <!-- Action Buttons -->
        <view class="action-row">
          <view
            v-if="episodes.length"
            class="btn-play"
            @tap="goPlay(episodes[0].episode_number)"
          >
            <text class="btn-play-text">▶ Start Watching</text>
          </view>
          <view class="btn-secondary">
            <text class="btn-secondary-text">+ My List</text>
          </view>
        </view>

        <!-- Description -->
        <view v-if="drama.description" class="desc-section">
          <text class="desc-text" :class="{ 'line-clamp-3': !isExpanded }">{{ drama.description }}</text>
          <text class="desc-toggle" @tap="isExpanded = !isExpanded">
            {{ isExpanded ? 'Show less' : 'More' }}
          </text>
        </view>

        <!-- Tags -->
        <view v-if="(drama as any).drama_tags?.length" class="tags-wrap">
          <text
            v-for="dt in (drama as any).drama_tags"
            :key="dt.tag_id"
            class="tag-item"
          >
            {{ dt.tags?.name }}
          </text>
        </view>

        <!-- Episodes -->
        <view class="episodes-section">
          <text class="episodes-title">Episodes ({{ drama.total_episodes }})</text>

          <!-- Episode Groups -->
          <scroll-view v-if="episodeGroups.length > 1" scroll-x class="group-scroll">
            <view class="group-tabs">
              <view
                v-for="(group, i) in episodeGroups"
                :key="i"
                class="group-tab"
                :class="{ 'group-tab-active': activeGroup === i }"
                @tap="activeGroup = i"
              >
                <text class="group-tab-text" :class="{ 'group-tab-text-active': activeGroup === i }">{{ group.label }}</text>
              </view>
            </view>
          </scroll-view>

          <!-- Episode Grid -->
          <view class="episode-grid">
            <view
              v-for="ep in (episodeGroups[activeGroup]?.episodes || [])"
              :key="ep.id"
              class="episode-item"
              @tap="goPlay(ep.episode_number)"
            >
              <text class="episode-number">{{ ep.episode_number }}</text>
              <view v-if="!ep.is_free" class="episode-lock">
                <text class="lock-icon">🔒</text>
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
.page-movie {
  min-height: 100vh;
  background-color: #030712;
}
.scroll-content {
  height: 100vh;
}
.loading-wrap {
  padding: 32rpx;
}
.skeleton-cover {
  width: 100%;
  height: 400rpx;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
}
.skeleton-title {
  width: 60%;
  height: 48rpx;
  margin-bottom: 20rpx;
}
.skeleton-text {
  width: 100%;
  height: 32rpx;
  margin-bottom: 12rpx;
}
.cover-wrap {
  position: relative;
  width: 100%;
  height: 450rpx;
}
.cover-image {
  width: 100%;
  height: 100%;
}
.cover-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200rpx;
  background: linear-gradient(to top, #030712 0%, transparent 100%);
}
.info-section {
  padding: 0 32rpx;
  margin-top: -60rpx;
  position: relative;
  z-index: 10;
}
.drama-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffffff;
}
.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 16rpx;
}
.meta-item {
  font-size: 24rpx;
  color: #9ca3af;
}
.meta-badge {
  padding: 4rpx 16rpx;
  border: 1rpx solid #6b7280;
  border-radius: 6rpx;
  font-size: 22rpx;
  color: #9ca3af;
}
.action-row {
  display: flex;
  gap: 20rpx;
  margin-top: 28rpx;
}
.btn-play {
  flex: 1;
  background-color: #f97316;
  border-radius: 16rpx;
  padding: 24rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-play-text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
}
.btn-secondary {
  padding: 24rpx 32rpx;
  background-color: #1f2937;
  border-radius: 16rpx;
}
.btn-secondary-text {
  color: #ffffff;
  font-size: 28rpx;
}
.desc-section {
  margin-top: 28rpx;
}
.desc-text {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.7;
}
.desc-toggle {
  font-size: 26rpx;
  color: #f97316;
  margin-top: 8rpx;
}
.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 20rpx;
}
.tag-item {
  padding: 8rpx 16rpx;
  background-color: #374151;
  border-radius: 6rpx;
  font-size: 22rpx;
  color: #9ca3af;
}
.episodes-section {
  margin-top: 40rpx;
}
.episodes-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 24rpx;
}
.group-scroll {
  white-space: nowrap;
  margin-bottom: 20rpx;
}
.group-tabs {
  display: inline-flex;
  gap: 16rpx;
}
.group-tab {
  padding: 12rpx 28rpx;
  border-radius: 40rpx;
  background-color: #111827;
  flex-shrink: 0;
}
.group-tab-active {
  background-color: #f97316;
}
.group-tab-text {
  font-size: 24rpx;
  color: #9ca3af;
}
.group-tab-text-active {
  color: #ffffff;
}
.episode-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16rpx;
}
.episode-item {
  position: relative;
  aspect-ratio: 16/9;
  background-color: #111827;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.episode-number {
  font-size: 26rpx;
  font-weight: 500;
  color: #ffffff;
}
.episode-lock {
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
.lock-icon {
  font-size: 20rpx;
}
.safe-bottom {
  height: 120rpx;
}
</style>
