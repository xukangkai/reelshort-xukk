<script setup lang="ts">
useHead({ title: 'FAQ - ReelShort' })
const openIndex = ref<number | null>(null)
const toggle = (i: number) => { openIndex.value = openIndex.value === i ? null : i }

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
  <div class="max-w-4xl mx-auto px-4 py-12 pb-20 lg:pb-8">
    <h1 class="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
    <div class="space-y-3">
      <button
        v-for="(item, i) in items" :key="i"
        @click="toggle(i)"
        class="w-full text-left bg-surface rounded-xl p-5 hover:bg-surface-light transition-colors"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-white pr-4">{{ item.q }}</h3>
          <svg class="w-5 h-5 shrink-0 transition-transform" :class="openIndex === i && 'rotate-180'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <p v-if="openIndex === i" class="text-text-secondary text-sm mt-3">{{ item.a }}</p>
      </button>
    </div>
  </div>
</template>
