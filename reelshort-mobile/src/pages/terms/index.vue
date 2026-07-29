<template>
  <view class="page-terms">
    <scroll-view scroll-y class="scroll-content">
      <view class="content">
        <text class="page-title">Terms of Service</text>
        <text class="update-date">Last updated: July 2025</text>

        <view class="section">
          <text class="section-title">1. Acceptance of Terms</text>
          <text class="body-text">By accessing or using ReelShort, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</text>
        </view>
        <view class="section">
          <text class="section-title">2. Use of Service</text>
          <text class="body-text">You may use ReelShort for personal, non-commercial purposes only. You must be at least 13 years old to create an account.</text>
        </view>
        <view class="section">
          <text class="section-title">3. Content</text>
          <text class="body-text">All content on ReelShort is owned by or licensed to us. You may not reproduce, distribute, or create derivative works without our permission.</text>
        </view>
        <view class="section">
          <text class="section-title">4. User Accounts</text>
          <text class="body-text">You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</text>
        </view>
        <view class="section">
          <text class="section-title">5. Virtual Currency</text>
          <text class="body-text">Coins purchased or earned on ReelShort have no real-world monetary value and are non-refundable except as required by law.</text>
        </view>
        <view class="section">
          <text class="section-title">6. Termination</text>
          <text class="body-text">We reserve the right to suspend or terminate your account for violations of these terms.</text>
        </view>
      </view>
      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-terms { min-height: 100vh; background-color: #030712; }
.scroll-content { height: 100vh; }
.content { padding: 32rpx; }
.page-title { font-size: 40rpx; font-weight: bold; color: #ffffff; margin-bottom: 16rpx; }
.update-date { font-size: 26rpx; color: #6b7280; margin-bottom: 40rpx; }
.section { margin-bottom: 32rpx; }
.section-title { font-size: 30rpx; font-weight: bold; color: #ffffff; margin-bottom: 12rpx; }
.body-text { font-size: 26rpx; color: #9ca3af; line-height: 1.7; }
.safe-bottom { height: 120rpx; }
</style>
