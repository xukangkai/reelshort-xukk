<script setup lang="ts">
const faqs = [
  { q: 'How do I watch dramas?', a: 'Browse our catalog and click on any drama to start watching. Free episodes are available immediately.' },
  { q: 'How do coins work?', a: 'Coins unlock premium episodes. Earn them through daily check-ins, or purchase them in the shop.' },
  { q: 'Can I watch offline?', a: 'Yes! Download episodes in the mobile app to watch without an internet connection.' },
  { q: 'How do I cancel a subscription?', a: 'Go to Profile > Subscription > Cancel. Your access continues until the billing period ends.' },
]
</script>

<template>
  <view class="page-help">
    <scroll-view scroll-y class="scroll-content">
      <view class="content">
        <view v-for="(faq, i) in faqs" :key="i" class="faq-card">
          <text class="faq-q">{{ faq.q }}</text>
          <text class="faq-a">{{ faq.a }}</text>
        </view>

        <view class="contact-card">
          <text class="contact-text">Still need help?</text>
          <navigator url="/pages/contact/index" class="contact-btn">
            <text class="contact-btn-text">Contact Us</text>
          </navigator>
        </view>
      </view>
      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-help {
  min-height: 100vh;
  background-color: #030712;
}
.scroll-content {
  height: 100vh;
}
.content {
  padding: 32rpx;
}
.faq-card {
  background-color: #1f2937;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
}
.faq-q {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12rpx;
}
.faq-a {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.6;
}
.contact-card {
  background-color: #1f2937;
  border-radius: 20rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20rpx;
}
.contact-text {
  font-size: 28rpx;
  color: #9ca3af;
  margin-bottom: 24rpx;
}
.contact-btn {
  padding: 20rpx 48rpx;
  background-color: #f97316;
  border-radius: 12rpx;
}
.contact-btn-text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
}
.safe-bottom {
  height: 120rpx;
}
</style>
