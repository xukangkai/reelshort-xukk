<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <p class="text-6xl font-bold text-brand mb-4">{{ error.statusCode || 500 }}</p>
      <h1 class="text-2xl font-bold mb-3">{{ error.statusCode === 404 ? 'Page Not Found' : 'Something Went Wrong' }}</h1>
      <p class="text-gray-400 mb-6">{{ error.message || 'An unexpected error occurred.' }}</p>
      <button @click="handleError" class="px-6 py-3 bg-brand hover:bg-brand-dark rounded-lg font-medium transition-colors">
        Back to Home
      </button>
    </div>
  </div>
</template>
