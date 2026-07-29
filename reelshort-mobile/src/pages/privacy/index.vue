<template>
  <view class="page-privacy">
    <scroll-view scroll-y class="scroll-content">
      <view class="content">
        <text class="page-title">Privacy Policy</text>
        <text class="update-date">Last updated: July 2025</text>

        <view class="section">
          <text class="section-title">1. Information We Collect</text>
          <text class="body-text">We collect information you provide directly (account info, payment data) and automatically (device info, viewing history, IP address).</text>
        </view>
        <view class="section">
          <text class="section-title">2. How We Use Your Information</text>
          <text class="body-text">We use your information to provide and improve our services, personalize content, process transactions, and communicate with you.</text>
        </view>
        <view class="section">
          <text class="section-title">3. Data Sharing</text>
          <text class="body-text">We do not sell your personal data. We share data only with service providers who help us operate our platform.</text>
        </view>
        <view class="section">
          <text class="section-title">4. Data Security</text>
          <text class="body-text">We implement industry-standard security measures to protect your data, including encryption and secure servers.</text>
        </view>
        <view class="section">
          <text class="section-title">5. Your Rights</text>
          <text class="body-text">You can access, update, or delete your personal data at any time through your account settings or by contacting us.</text>
        </view>
        <view class="section">
          <text class="section-title">6. Contact Us</text>
          <text class="body-text">For privacy-related inquiries, contact us at privacy@reelshort.com</text>
        </view>
      </view>
      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-privacy { min-height: 100vh; background-color: #030712; }
.scroll-content { height: 100vh; }
.content { padding: 32rpx; }
.page-title { font-size: 40rpx; font-weight: bold; color: #ffffff; margin-bottom: 16rpx; }
.update-date { font-size: 26rpx; color: #6b7280; margin-bottom: 40rpx; }
.section { margin-bottom: 32rpx; }
.section-title { font-size: 30rpx; font-weight: bold; color: #ffffff; margin-bottom: 12rpx; }
.body-text { font-size: 26rpx; color: #9ca3af; line-height: 1.7; }
.safe-bottom { height: 120rpx; }
</style>
