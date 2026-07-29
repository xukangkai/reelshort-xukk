<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import supabase from '@/utils/supabase'
import DramaCard from '@/components/DramaCard.vue'

const slug = ref('')
const category = ref<any>(null)
const dramas = ref<any[]>([])
const sortBy = ref('trending')
const loading = ref(true)

onMounted(async () => {
  // Get slug from URL params
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  slug.value = page?.$page?.options?.slug || page?.options?.slug || ''
  if (slug.value) {
    await fetchCategory()
    await fetchDramas()
  }
})

async function fetchCategory() {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug.value)
    .eq('is_active', true)
    .single()
  category.value = data
  if (data) {
    uni.setNavigationBarTitle({ title: data.name })
  }
}

async function fetchDramas() {
  loading.value = true
  const { data } = await supabase
    .from('drama_categories')
    .select('dramas(*)')
    .eq('category_id', category.value?.id)
    .eq('dramas.status', 'published')
    .limit(40)
  dramas.value = (data as any[])?.map(d => d.dramas).filter(Boolean) || []
  loading.value = false
}

const sortOptions = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
]

function setSort(val: string) {
  sortBy.value = val
  fetchDramas()
}
</script>

<template>
  <view class="page-detail">
    <scroll-view scroll-y class="scroll-content">
      <!-- Category Header -->
      <view class="cat-header">
        <text class="cat-title">{{ category?.name }}</text>
        <text v-if="category?.description" class="cat-desc">{{ category.description }}</text>
      </view>

      <!-- Sort Options -->
      <view class="sort-wrap">
        <text class="sort-label">Sort by:</text>
        <view class="sort-btns">
          <view
            v-for="opt in sortOptions"
            :key="opt.value"
            class="sort-btn"
            :class="{ 'sort-btn-active': sortBy === opt.value }"
            @tap="setSort(opt.value)"
          >
            <text class="sort-btn-text" :class="{ 'sort-btn-text-active': sortBy === opt.value }">{{ opt.label }}</text>
          </view>
        </view>
      </view>

      <!-- Loading -->
      <view v-if="loading" class="loading-grid">
        <view v-for="i in 6" :key="i" class="skeleton-card" />
      </view>

      <!-- Drama Grid -->
      <view v-else class="drama-grid">
        <view v-for="drama in dramas" :key="drama.id" class="grid-item">
          <DramaCard :drama="drama" />
        </view>
      </view>

      <!-- Empty -->
      <view v-if="!loading && !dramas.length" class="empty-state">
        <text class="empty-text">No dramas in this category yet.</text>
      </view>

      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-detail {
  min-height: 100vh;
  background-color: #030712;
}
.scroll-content {
  height: 100vh;
}
.cat-header {
  padding: 32rpx;
}
.cat-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffffff;
}
.cat-desc {
  font-size: 26rpx;
  color: #9ca3af;
  margin-top: 12rpx;
}
.sort-wrap {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 0 32rpx 24rpx;
}
.sort-label {
  font-size: 26rpx;
  color: #6b7280;
}
.sort-btns {
  display: flex;
  gap: 12rpx;
}
.sort-btn {
  padding: 10rpx 24rpx;
  border-radius: 40rpx;
  background-color: #111827;
}
.sort-btn-active {
  background-color: #f97316;
}
.sort-btn-text {
  font-size: 24rpx;
  color: #9ca3af;
}
.sort-btn-text-active {
  color: #ffffff;
}
.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 0 32rpx;
}
.skeleton-card {
  height: 280rpx;
  border-radius: 12rpx;
}
.drama-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 0 32rpx;
}
.grid-item {
  width: 100%;
}
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}
.empty-text {
  font-size: 28rpx;
  color: #6b7280;
}
.safe-bottom {
  height: 120rpx;
}
</style>
