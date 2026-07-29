<script setup lang="ts">
import { ref, onMounted } from 'vue'
import supabase from '@/utils/supabase'
import ShelfRow from '@/components/ShelfRow.vue'

const banners = ref<any[]>([])
const shelves = ref<any[]>([])
const trending = ref<any[]>([])
const loading = ref(true)

// Banner carousel state
const currentBanner = ref(0)
let bannerTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  await Promise.all([fetchBanners(), fetchShelves(), fetchTrending()])
  loading.value = false
  startBannerTimer()
})

function startBannerTimer() {
  if (bannerTimer) clearInterval(bannerTimer)
  bannerTimer = setInterval(() => {
    if (banners.value.length > 0) {
      currentBanner.value = (currentBanner.value + 1) % banners.value.length
    }
  }, 4000)
}

async function fetchBanners() {
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('sort_order')
  banners.value = data || []
}

async function fetchShelves() {
  const { data } = await supabase
    .from('shelves')
    .select('*, shelf_items(*, dramas:drama_id(*))')
    .eq('is_active', true)
    .order('sort_order')
  shelves.value = data || []
}

async function fetchTrending() {
  const { data } = await supabase
    .from('dramas')
    .select('*')
    .eq('status', 'published')
    .order('trending_score', { ascending: false })
    .limit(20)
  trending.value = data || []
}

function onBannerTap(banner: any) {
  if (banner.link_type === 'drama') {
    uni.navigateTo({ url: `/pages/movie/detail?slug=${banner.link_value}` })
  } else if (banner.link_type === 'url') {
    // Open external URL
  }
}

function onSwiperChange(e: any) {
  currentBanner.value = e.detail.current
}

function goSearch() {
  uni.switchTab({ url: '/pages/search/index' })
}
</script>

<template>
  <view class="page-home">
    <!-- Custom Header -->
    <view class="header" :style="{ paddingTop: '44px' }">
      <view class="header-content">
        <text class="logo">ReelShort</text>
        <view class="header-actions" @tap="goSearch">
          <text class="search-icon">🔍</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- Banner Carousel -->
      <swiper
        v-if="banners.length"
        class="banner-swiper"
        :current="currentBanner"
        :autoplay="true"
        :interval="4000"
        :duration="500"
        circular
        indicator-dots
        indicator-color="rgba(255,255,255,0.3)"
        indicator-active-color="#f97316"
        @change="onSwiperChange"
      >
        <swiper-item v-for="banner in banners" :key="banner.id" @tap="onBannerTap(banner)">
          <image :src="banner.image_url" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>

      <!-- Loading state -->
      <view v-if="loading" class="loading-wrap">
        <view class="skeleton-banner" />
        <view class="skeleton-row" v-for="i in 3" :key="i" />
      </view>

      <!-- Content -->
      <view v-else class="content-area">
        <!-- Trending Section -->
        <ShelfRow v-if="trending.length" title="🔥 Trending" :dramas="trending" />

        <!-- Dynamic Shelves -->
        <ShelfRow
          v-for="shelf in shelves"
          :key="shelf.id"
          :title="shelf.title"
          :dramas="(shelf as any).shelf_items?.map((i: any) => i.dramas).filter(Boolean) || []"
        />

        <!-- Empty state -->
        <view v-if="!trending.length && !shelves.length" class="empty-state">
          <text class="empty-icon">🎬</text>
          <text class="empty-text">Coming soon...</text>
        </view>
      </view>

      <!-- Bottom safe area -->
      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-home {
  min-height: 100vh;
  background-color: #030712;
}
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(3, 7, 18, 0.95);
  backdrop-filter: blur(10px);
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 32rpx 16rpx;
}
.logo {
  font-size: 40rpx;
  font-weight: bold;
  color: #f97316;
}
.header-actions {
  padding: 12rpx;
}
.search-icon {
  font-size: 36rpx;
}
.scroll-content {
  height: calc(100vh - 100px);
}
.banner-swiper {
  width: 100%;
  height: 380rpx;
}
.banner-image {
  width: 100%;
  height: 100%;
}
.content-area {
  padding-top: 32rpx;
}
.loading-wrap {
  padding: 32rpx;
}
.skeleton-banner {
  width: 100%;
  height: 380rpx;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
}
.skeleton-row {
  width: 100%;
  height: 200rpx;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}
.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}
.empty-text {
  font-size: 30rpx;
  color: #6b7280;
}
.safe-bottom {
  height: 120rpx;
}
</style>
