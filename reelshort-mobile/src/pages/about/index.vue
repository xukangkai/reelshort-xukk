<template>
  <view class="page-about">
    <scroll-view scroll-y class="scroll-content">
      <view class="content">
        <text class="page-title">About ReelShort</text>
        <view class="section">
          <text class="body-text">ReelShort is the premier destination for short-form drama content. We bring you bite-sized stories that captivate, entertain, and inspire — anytime, anywhere.</text>
        </view>
        <view class="section">
          <text class="section-title">Our Mission</text>
          <text class="body-text">To make every second count. We believe great storytelling doesn't need hours — it just needs the right moments.</text>
        </view>
        <view class="section">
          <text class="section-title">What We Offer</text>
          <text class="body-text">• Thousands of original short dramas across every genre</text>
          <text class="body-text">• New episodes released daily</text>
          <text class="body-text">• Free-to-watch content with optional premium features</text>
          <text class="body-text">• Available on web, iOS, and Android</text>
        </view>
        <view class="section">
          <text class="section-title">Contact</text>
          <text class="body-text">Have questions or feedback? Reach us at support@reelshort.com</text>
        </view>
      </view>
      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-about { min-height: 100vh; background-color: #030712; }
.scroll-content { height: 100vh; }
.content { padding: 32rpx; }
.page-title { font-size: 40rpx; font-weight: bold; color: #ffffff; margin-bottom: 32rpx; }
.section { margin-bottom: 32rpx; }
.section-title { font-size: 32rpx; font-weight: bold; color: #ffffff; margin-bottom: 16rpx; }
.body-text { font-size: 28rpx; color: #9ca3af; line-height: 1.7; margin-bottom: 8rpx; }
.safe-bottom { height: 120rpx; }
</style>
