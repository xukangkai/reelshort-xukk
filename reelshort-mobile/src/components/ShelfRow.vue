<script setup lang="ts">
const props = defineProps<{
  dramas: any[]
  title: string
}>()

function goDetail(slug: string) {
  uni.navigateTo({
    url: `/pages/movie/detail?slug=${slug}`
  })
}
</script>

<template>
  <view class="shelf-row">
    <view class="shelf-header">
      <text class="shelf-title">{{ title }}</text>
    </view>
    <scroll-view scroll-x class="shelf-scroll">
      <view class="shelf-items">
        <view
          v-for="drama in dramas"
          :key="drama.id"
          class="shelf-item"
          @tap="goDetail(drama.slug)"
        >
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
              <text class="placeholder-text">{{ drama.title }}</text>
            </view>
          </view>
          <text class="item-title">{{ drama.title }}</text>
          <text class="item-meta">{{ drama.total_episodes }} EP</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.shelf-row {
  margin-bottom: 40rpx;
}
.shelf-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  margin-bottom: 20rpx;
}
.shelf-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
}
.shelf-scroll {
  white-space: nowrap;
}
.shelf-items {
  display: inline-flex;
  gap: 16rpx;
  padding: 0 32rpx;
}
.shelf-item {
  width: 220rpx;
  flex-shrink: 0;
}
.poster-wrap {
  width: 220rpx;
  height: 293rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #1f2937;
}
.poster-img {
  width: 100%;
  height: 100%;
}
.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx;
}
.placeholder-text {
  color: #6b7280;
  font-size: 22rpx;
  text-align: center;
}
.item-title {
  font-size: 24rpx;
  color: #ffffff;
  margin-top: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
.item-meta {
  font-size: 20rpx;
  color: #6b7280;
  margin-top: 2rpx;
}
</style>
