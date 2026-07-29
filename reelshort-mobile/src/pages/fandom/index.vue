<script setup lang="ts">
function goHome() {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<template>
  <view class="page-fandom">
    <view class="content">
      <view class="empty-state">
        <text class="empty-icon">🎭</text>
        <text class="empty-title">Fandom</text>
        <text class="empty-desc">Community articles coming soon. Stay tuned for fan discussions, behind-the-scenes content, and more.</text>
        <view class="browse-btn" @tap="goHome">
          <text class="browse-text">Browse Dramas</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-fandom { min-height: 100vh; background-color: #030712; }
.content { padding: 32rpx; }
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 40rpx;
}
.empty-icon { font-size: 96rpx; margin-bottom: 28rpx; opacity: 0.5; }
.empty-title { font-size: 36rpx; font-weight: 600; color: #ffffff; margin-bottom: 16rpx; }
.empty-desc { font-size: 28rpx; color: #6b7280; text-align: center; margin-bottom: 40rpx; }
.browse-btn { padding: 24rpx 48rpx; background-color: #f97316; border-radius: 16rpx; }
.browse-text { color: #ffffff; font-size: 28rpx; font-weight: 600; }
</style>
