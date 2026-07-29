<script setup lang="ts">
import { ref } from 'vue'

const openIndex = ref<number | null>(null)
function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

const items = [
  { q: 'What is ReelShort?', a: 'ReelShort is a short-form drama streaming platform with thousands of bite-sized stories across every genre.' },
  { q: 'Is ReelShort free?', a: 'Many episodes are free to watch. Premium episodes can be unlocked with coins or a VIP subscription.' },
  { q: 'How do I earn free coins?', a: 'Daily check-ins, watching rewarded content, and referring friends all earn free coins.' },
  { q: 'What devices are supported?', a: 'ReelShort works on web browsers, iOS, and Android devices.' },
  { q: 'Can I download episodes?', a: 'Yes, the mobile app supports offline downloads for watching without internet.' },
  { q: 'How do I report inappropriate content?', a: 'Use the report button on any drama or comment, or contact our support team.' },
  { q: 'Are subtitles available?', a: 'Yes, we provide subtitles in multiple languages for most of our content.' },
  { q: 'How do I become a VIP member?', a: 'Go to Profile > VIP to subscribe. VIP members get unlimited access to all premium content.' },
]
</script>

<template>
  <view class="page-faq">
    <scroll-view scroll-y class="scroll-content">
      <view class="content">
        <view
          v-for="(item, i) in items"
          :key="i"
          class="faq-item"
          @tap="toggle(i)"
        >
          <view class="faq-header">
            <text class="faq-q">{{ item.q }}</text>
            <text class="faq-arrow" :class="{ 'faq-arrow-open': openIndex === i }">▼</text>
          </view>
          <text v-if="openIndex === i" class="faq-a">{{ item.a }}</text>
        </view>
      </view>
      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-faq {
  min-height: 100vh;
  background-color: #030712;
}
.scroll-content {
  height: 100vh;
}
.content {
  padding: 32rpx;
}
.faq-item {
  background-color: #1f2937;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 16rpx;
}
.faq-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.faq-q {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  padding-right: 16rpx;
}
.faq-arrow {
  font-size: 22rpx;
  color: #6b7280;
  transition: transform 0.2s;
}
.faq-arrow-open {
  transform: rotate(180deg);
}
.faq-a {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.6;
  margin-top: 20rpx;
}
.safe-bottom {
  height: 120rpx;
}
</style>
