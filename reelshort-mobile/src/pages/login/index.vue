<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const username = ref('')
const isSignUp = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  try {
    if (isSignUp.value) {
      await authStore.signup(email.value, password.value, username.value)
    } else {
      await authStore.login(email.value, password.value)
    }
    uni.switchTab({ url: '/pages/profile/index' })
  } catch (e: any) {
    error.value = e.message || 'Something went wrong'
  }
}

function toggleMode() {
  isSignUp.value = !isSignUp.value
  error.value = ''
}
</script>

<template>
  <view class="page-login">
    <view class="login-container">
      <!-- Logo -->
      <view class="logo-section">
        <text class="logo-text">ReelShort</text>
        <text class="logo-subtitle">{{ isSignUp ? 'Create your account' : 'Welcome back' }}</text>
      </view>

      <!-- Form -->
      <view class="form-card">
        <!-- Error -->
        <view v-if="error" class="error-box">
          <text class="error-text">{{ error }}</text>
        </view>

        <!-- Username (signup only) -->
        <view v-if="isSignUp" class="input-wrap">
          <input
            v-model="username"
            class="input-field"
            type="text"
            placeholder="Username"
            placeholder-style="color: #6b7280"
          />
        </view>

        <!-- Email -->
        <view class="input-wrap">
          <input
            v-model="email"
            class="input-field"
            type="text"
            placeholder="Email"
            placeholder-style="color: #6b7280"
          />
        </view>

        <!-- Password -->
        <view class="input-wrap">
          <input
            v-model="password"
            class="input-field"
            type="password"
            placeholder="Password"
            placeholder-style="color: #6b7280"
            @confirm="handleSubmit"
          />
        </view>

        <!-- Submit -->
        <view class="submit-btn" :class="{ 'btn-disabled': authStore.loading }" @tap="handleSubmit">
          <text class="submit-text">
            {{ authStore.loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In') }}
          </text>
        </view>

        <!-- Divider -->
        <view class="divider">
          <view class="divider-line" />
          <text class="divider-text">or</text>
          <view class="divider-line" />
        </view>

        <!-- Google Login (placeholder) -->
        <view class="google-btn">
          <text class="google-text">Continue with Google</text>
        </view>

        <!-- Toggle -->
        <view class="toggle-row">
          <text class="toggle-text">
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
          </text>
          <text class="toggle-link" @tap="toggleMode">
            {{ isSignUp ? 'Sign In' : 'Sign Up' }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-login {
  min-height: 100vh;
  background-color: #030712;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}
.login-container {
  width: 100%;
  max-width: 700rpx;
}
.logo-section {
  text-align: center;
  margin-bottom: 60rpx;
}
.logo-text {
  font-size: 56rpx;
  font-weight: bold;
  color: #f97316;
}
.logo-subtitle {
  font-size: 28rpx;
  color: #9ca3af;
  margin-top: 12rpx;
}
.form-card {
  background-color: #1f2937;
  border-radius: 24rpx;
  padding: 40rpx;
}
.error-box {
  background-color: rgba(127, 29, 29, 0.3);
  border: 1rpx solid rgba(239, 68, 68, 0.3);
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
}
.error-text {
  font-size: 26rpx;
  color: #f87171;
}
.input-wrap {
  margin-bottom: 20rpx;
}
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
.submit-btn {
  width: 100%;
  height: 88rpx;
  background-color: #f97316;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12rpx;
}
.btn-disabled {
  opacity: 0.5;
}
.submit-text {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
}
.divider {
  display: flex;
  align-items: center;
  margin: 32rpx 0;
}
.divider-line {
  flex: 1;
  height: 1rpx;
  background-color: #374151;
}
.divider-text {
  padding: 0 20rpx;
  font-size: 24rpx;
  color: #6b7280;
}
.google-btn {
  width: 100%;
  height: 88rpx;
  background-color: #111827;
  border: 2rpx solid #374151;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.google-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}
.toggle-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 28rpx;
  flex-wrap: wrap;
  gap: 8rpx;
}
.toggle-text {
  font-size: 26rpx;
  color: #9ca3af;
}
.toggle-link {
  font-size: 26rpx;
  color: #f97316;
}
</style>
