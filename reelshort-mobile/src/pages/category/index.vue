<script setup lang="ts">
import { ref, onMounted } from 'vue'
import supabase from '@/utils/supabase'

const categories = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  categories.value = data || []
  loading.value = false
})

function goCategoryDetail(slug: string) {
  uni.navigateTo({ url: `/pages/category/detail?slug=${slug}` })
}
</script>

<template>
  <view class="page-category">
    <!-- Loading -->
    <view v-if="loading" class="loading-wrap">
      <view v-for="i in 6" :key="i" class="skeleton-card" />
    </view>

    <!-- Categories Grid -->
    <scroll-view v-else scroll-y class="scroll-content">
      <view class="grid-wrap">
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="cat-card"
          @tap="goCategoryDetail(cat.slug)"
        >
          <view class="cat-icon-wrap">
            <text class="cat-icon">🎭</text>
          </view>
          <text class="cat-name">{{ cat.name }}</text>
          <text v-if="cat.description" class="cat-desc line-clamp-2">{{ cat.description }}</text>
        </view>
      </view>

      <!-- Empty state -->
      <view v-if="!categories.length" class="empty-state">
        <text class="empty-icon">📂</text>
        <text class="empty-text">No categories yet</text>
      </view>

      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-category {
  min-height: 100vh;
  background-color: #030712;
}
.scroll-content {
  height: 100vh;
  padding: 24rpx;
}
.loading-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  padding: 24rpx;
}
.skeleton-card {
  height: 200rpx;
  border-radius: 20rpx;
}
.grid-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}
.cat-card {
  background-color: #111827;
  border-radius: 20rpx;
  padding: 40rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.cat-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background-color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}
.cat-icon {
  font-size: 44rpx;
}
.cat-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}
.cat-desc {
  font-size: 22rpx;
  color: #6b7280;
  margin-top: 8rpx;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
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
