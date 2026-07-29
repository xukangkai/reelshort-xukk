<script setup lang="ts">
import { formatNumber } from '@/utils/format'

const props = defineProps<{
  drama: {
    id: string
    slug: string
    title: string
    poster_url: string | null
    views_count: number
    rating: number | null
    is_featured: boolean
    age_rating: string
    total_episodes: number
  }
}>()

function goDetail() {
  uni.navigateTo({
    url: `/pages/movie/detail?slug=${props.drama.slug}`
  })
}
</script>

<template>
  <view class="drama-card" @tap="goDetail">
    <!-- Poster -->
    <view class="poster-wrap">
      <image
        v-if="drama.poster_url"
        :src="drama.poster_url"
        :alt="drama.title"
        mode="aspectFill"
        class="poster-img"
        lazy-load
      />
      <view v-else class="poster-placeholder">
        <text class="poster-placeholder-text">{{ drama.title }}</text>
      </view>

      <!-- Badges -->
      <view class="badges">
        <text v-if="drama.is_featured" class="badge badge-hot">HOT</text>
        <text v-if="drama.age_rating !== 'All'" class="badge badge-rating">{{ drama.age_rating }}</text>
      </view>
    </view>

    <!-- Info -->
    <view class="info">
      <text class="title">{{ drama.title }}</text>
      <view class="meta">
        <text class="meta-text">{{ formatNumber(drama.views_count) }} views</text>
        <text v-if="drama.rating" class="meta-text">⭐ {{ drama.rating }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.drama-card {
  width: 100%;
}
.poster-wrap {
  position: relative;
  width: 100%;
  padding-top: 133%; /* 3:4 aspect ratio */
  background-color: #1f2937;
  border-radius: 12rpx;
  overflow: hidden;
}
.poster-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.poster-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx;
}
.poster-placeholder-text {
  color: #6b7280;
  font-size: 24rpx;
  text-align: center;
}
.badges {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  display: flex;
  gap: 4rpx;
}
.badge {
  padding: 2rpx 8rpx;
  font-size: 18rpx;
  font-weight: bold;
  border-radius: 4rpx;
}
.badge-hot {
  background-color: #f97316;
  color: #ffffff;
}
.badge-rating {
  background-color: rgba(0, 0, 0, 0.6);
  color: #ffffff;
}
.info {
  margin-top: 12rpx;
  padding: 0 4rpx;
}
.title {
  font-size: 26rpx;
  font-weight: 500;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
.meta {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 4rpx;
}
.meta-text {
  font-size: 22rpx;
  color: #6b7280;
}
</style>
