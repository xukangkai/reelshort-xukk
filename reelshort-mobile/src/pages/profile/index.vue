<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.init()
})

function goLogin() {
  uni.navigateTo({ url: '/pages/login/index' })
}

function goMyList() {
  uni.navigateTo({ url: '/pages/my-list/index' })
}

function goHelp() {
  uni.navigateTo({ url: '/pages/help/index' })
}

function goAbout() {
  uni.navigateTo({ url: '/pages/about/index' })
}

function goFAQ() {
  uni.navigateTo({ url: '/pages/faq/index' })
}

function goContact() {
  uni.navigateTo({ url: '/pages/contact/index' })
}

function goPrivacy() {
  uni.navigateTo({ url: '/pages/privacy/index' })
}

function goTerms() {
  uni.navigateTo({ url: '/pages/terms/index' })
}

async function handleLogout() {
  await authStore.logout()
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<template>
  <view class="page-profile">
    <scroll-view scroll-y class="scroll-content">
      <!-- Not logged in -->
      <view v-if="!authStore.isLoggedIn" class="not-logged-in">
        <view class="avatar-placeholder">
          <text class="avatar-icon">👤</text>
        </view>
        <text class="login-prompt">Sign in to access your profile</text>
        <view class="login-btn" @tap="goLogin">
          <text class="login-btn-text">Sign In</text>
        </view>
      </view>

      <!-- Logged in -->
      <view v-else class="profile-content">
        <!-- User Card -->
        <view class="user-card">
          <view class="user-avatar">
            <text class="avatar-letter">{{ authStore.displayName?.[0]?.toUpperCase() || 'U' }}</text>
          </view>
          <view class="user-info">
            <text class="user-name">{{ authStore.displayName }}</text>
            <text class="user-email">{{ authStore.user?.email }}</text>
          </view>
        </view>

        <!-- Quick Actions -->
        <view class="quick-actions">
          <view class="action-card" @tap="goMyList">
            <text class="action-icon">📚</text>
            <text class="action-label">My List</text>
          </view>
          <view class="action-card">
            <text class="action-icon">🪙</text>
            <text class="action-label">Coins</text>
          </view>
          <view class="action-card">
            <text class="action-icon">⭐</text>
            <text class="action-label">VIP</text>
          </view>
          <view class="action-card" @tap="goHelp">
            <text class="action-icon">❓</text>
            <text class="action-label">Help</text>
          </view>
        </view>

        <!-- Menu List -->
        <view class="menu-list">
          <view class="menu-item" @tap="goFAQ">
            <text class="menu-label">FAQ</text>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-item" @tap="goAbout">
            <text class="menu-label">About</text>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-item" @tap="goContact">
            <text class="menu-label">Contact Us</text>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-item" @tap="goPrivacy">
            <text class="menu-label">Privacy Policy</text>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-item" @tap="goTerms">
            <text class="menu-label">Terms of Service</text>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-item menu-item-danger" @tap="handleLogout">
            <text class="menu-label-danger">Sign Out</text>
          </view>
        </view>
      </view>

      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-profile {
  min-height: 100vh;
  background-color: #030712;
}
.scroll-content {
  height: 100vh;
  padding: 32rpx;
}
.not-logged-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0 80rpx;
}
.avatar-placeholder {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background-color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}
.avatar-icon {
  font-size: 64rpx;
}
.login-prompt {
  font-size: 30rpx;
  color: #9ca3af;
  margin-bottom: 40rpx;
}
.login-btn {
  padding: 24rpx 80rpx;
  background-color: #f97316;
  border-radius: 16rpx;
}
.login-btn-text {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
}
.profile-content {
  padding-top: 20rpx;
}
.user-card {
  background-color: #1f2937;
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  gap: 28rpx;
  margin-bottom: 32rpx;
}
.user-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-letter {
  font-size: 44rpx;
  font-weight: bold;
  color: #ffffff;
}
.user-info {
  flex: 1;
}
.user-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}
.user-email {
  font-size: 24rpx;
  color: #6b7280;
  margin-top: 4rpx;
}
.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-bottom: 32rpx;
}
.action-card {
  background-color: #1f2937;
  border-radius: 20rpx;
  padding: 28rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.action-icon {
  font-size: 44rpx;
  margin-bottom: 8rpx;
}
.action-label {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 500;
}
.menu-list {
  background-color: #1f2937;
  border-radius: 24rpx;
  overflow: hidden;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #374151;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-label {
  font-size: 28rpx;
  color: #ffffff;
}
.menu-arrow {
  font-size: 32rpx;
  color: #6b7280;
}
.menu-item-danger {
  padding: 32rpx;
}
.menu-label-danger {
  font-size: 28rpx;
  color: #f87171;
}
.safe-bottom {
  height: 120rpx;
}
</style>
