<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({ name: '', email: '', subject: '', message: '' })
const submitted = ref(false)

function submit() {
  if (!form.name || !form.email || !form.message) {
    uni.showToast({ title: 'Please fill all fields', icon: 'none' })
    return
  }
  submitted.value = true
  uni.showToast({ title: 'Message sent!', icon: 'success' })
}
</script>

<template>
  <view class="page-contact">
    <scroll-view scroll-y class="scroll-content">
      <view class="content">
        <!-- Success -->
        <view v-if="submitted" class="success-card">
          <text class="success-icon">✅</text>
          <text class="success-title">Message Sent!</text>
          <text class="success-desc">We'll get back to you within 24 hours.</text>
        </view>

        <!-- Form -->
        <view v-else class="form">
          <view class="input-wrap">
            <input v-model="form.name" class="input-field" placeholder="Your Name" placeholder-style="color: #6b7280" />
          </view>
          <view class="input-wrap">
            <input v-model="form.email" class="input-field" type="text" placeholder="Email" placeholder-style="color: #6b7280" />
          </view>
          <view class="input-wrap">
            <input v-model="form.subject" class="input-field" placeholder="Subject" placeholder-style="color: #6b7280" />
          </view>
          <view class="input-wrap">
            <textarea
              v-model="form.message"
              class="textarea-field"
              placeholder="Your message..."
              placeholder-style="color: #6b7280"
              :maxlength="500"
            />
          </view>
          <view class="submit-btn" @tap="submit">
            <text class="submit-text">Send Message</text>
          </view>
        </view>
      </view>
      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped>
.page-contact { min-height: 100vh; background-color: #030712; }
.scroll-content { height: 100vh; }
.content { padding: 32rpx; }
.success-card {
  background-color: #1f2937;
  border-radius: 24rpx;
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.success-icon { font-size: 64rpx; margin-bottom: 24rpx; }
.success-title { font-size: 32rpx; font-weight: 600; color: #f97316; margin-bottom: 12rpx; }
.success-desc { font-size: 28rpx; color: #9ca3af; }
.form { }
.input-wrap { margin-bottom: 24rpx; }
.input-field {
  width: 100%;
  height: 88rpx;
  background-color: #111827;
  border: 2rpx solid #374151;
  border-radius: 16rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  color: #ffffff;
}
.textarea-field {
  width: 100%;
  height: 200rpx;
  background-color: #111827;
  border: 2rpx solid #374151;
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
  font-size: 28rpx;
  color: #ffffff;
}
.submit-btn {
  width: 100%;
  height: 88rpx;
  background-color: #f97316;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8rpx;
}
.submit-text { color: #ffffff; font-size: 30rpx; font-weight: 600; }
.safe-bottom { height: 120rpx; }
</style>
