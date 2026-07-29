<script setup lang="ts">
useHead({ title: 'Help Center - ReelShort' })

const faqs = [
  { q: 'How do I watch dramas?', a: 'Browse our catalog and click on any drama to start watching. Free episodes are available immediately.' },
  { q: 'How do coins work?', a: 'Coins unlock premium episodes. Earn them through daily check-ins, or purchase them in the shop.' },
  { q: 'Can I watch offline?', a: 'Yes! Download episodes in the mobile app to watch without an internet connection.' },
  { q: 'How do I cancel a subscription?', a: 'Go to Profile > Subscription > Cancel. Your access continues until the billing period ends.' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12 pb-20 lg:pb-8">
    <h1 class="text-3xl font-bold mb-8">Help Center</h1>
    <div class="space-y-4">
      <div v-for="(faq, i) in faqs" :key="i" class="bg-surface rounded-xl p-5">
        <h3 class="font-semibold text-white mb-2">{{ faq.q }}</h3>
        <p class="text-text-secondary text-sm">{{ faq.a }}</p>
      </div>
    </div>
    <div class="mt-8 p-6 bg-surface rounded-xl text-center">
      <p class="text-text-secondary mb-3">Still need help?</p>
      <NuxtLink to="/contact" class="inline-flex px-5 py-2.5 bg-brand hover:bg-brand-dark rounded-lg font-medium transition-colors">Contact Us</NuxtLink>
    </div>
  </div>
</template>
