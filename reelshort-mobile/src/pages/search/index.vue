<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import supabase from '@/utils/supabase'
import DramaCard from '@/components/DramaCard.vue'

const query = ref('')
const results = ref<any[]>([])
const searchHistory = ref<string[]>([])
const searching = ref(false)

onMounted(() => {
  try {
    const stored = uni.getStorageSync('search_history')
    if (stored) searchHistory.value = JSON.parse(stored)
  } catch {}
})

let searchTimer: ReturnType<typeof setTimeout> | null = null

function onInput(e: any) {
  query.value = e.detail.value
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(doSearch, 400)
}

async function doSearch() {
  if (query.value.length < 2) {
    results.value = []
    return
  }
  searching.value = true
  const { data } = await supabase
    .from('dramas')
    .select('*')
    .eq('status', 'published')
    .textSearch('search_vector', query.value)
    .limit(20)
  results.value = (data as any[]) || []
  searching.value = false

  // Save history
  const h = [query.value, ...searchHistory.value.filter(s => s !== query.value)].slice(0, 10)
  searchHistory.value = h
  uni.setStorageSync('search_history', JSON.stringify(h))
}

function useHistory(h: string) {
  query.value = h
  doSearch()
}

function clearHistory() {
  searchHistory.value = []
  uni.removeStorageSync('search_history')
}
</script>

<template>
  <view class="page-search">
    <!-- Search Bar -->
    <view class="search-bar" :style="{ paddingTop: '44px' }">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          :value="query"
          type="text"
          placeholder="Search dramas..."
          placeholder-style="color: #6b7280"
          @input="onInput"
          confirm-type="search"
          @confirm="doSearch"
        />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- Search History -->
      <view v-if="!query && searchHistory.length" class="history-section">
        <view class="history-header">
          <text class="history-title">Recent Searches</text>
          <text class="history-clear" @tap="clearHistory">Clear</text>
        </view>
        <view class="history-tags">
          <view
            v-for="h in searchHistory"
            :key="h"
            class="history-tag"
            @tap="useHistory(h)"
          >
            <text class="tag-text">{{ h }}</text>
          </view>
        </view>
      </view>

      <!-- Results -->
      <view v-if="results.length" class="results-grid">
        <view v-for="drama in results" :key="drama.id" class="grid-item">
          <DramaCard :drama="drama" />
        </view>
      </view>

      <!-- No results -->
      <view v-else-if="query.length >= 2 && !searching" class="empty-state">
        <text class="empty-icon">🔍</text>
        <text class="empty-text">No results for "{{ query }}"</text>
      </view>

      <!-- Searching -->
      <view v-if="searching" class="loading-state">
        <view class="skeleton-grid">
          <view v-for="i in 6" :key="i" class="skeleton-card" />
        </view>
      </view>

      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-search {
  min-height: 100vh;
  background-color: #030712;
}
.search-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(3, 7, 18, 0.95);
  padding-bottom: 20rpx;
}
.search-input-wrap {
  display: flex;
  align-items: center;
  margin: 16rpx 32rpx 0;
  background-color: #111827;
  border: 2rpx solid #374151;
  border-radius: 20rpx;
  padding: 0 24rpx;
}
.search-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}
.search-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
  color: #ffffff;
}
.scroll-content {
  height: calc(100vh - 140px);
}
.history-section {
  padding: 32rpx;
}
.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.history-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}
.history-clear {
  font-size: 24rpx;
  color: #6b7280;
}
.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.history-tag {
  background-color: #111827;
  border-radius: 40rpx;
  padding: 12rpx 24rpx;
}
.tag-text {
  font-size: 26rpx;
  color: #9ca3af;
}
.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 24rpx 32rpx;
}
.grid-item {
  width: 100%;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}
.empty-icon {
  font-size: 64rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}
.empty-text {
  font-size: 28rpx;
  color: #6b7280;
}
.loading-state {
  padding: 24rpx 32rpx;
}
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}
.skeleton-card {
  height: 280rpx;
  border-radius: 12rpx;
}
.safe-bottom {
  height: 120rpx;
}
</style>
