<script setup lang="ts">
useHead({ title: 'Contact Us - ReelShort' })
const form = reactive({ name: '', email: '', subject: '', message: '' })
const submitted = ref(false)
const submit = () => { submitted.value = true }
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-12 pb-20 lg:pb-8">
    <h1 class="text-3xl font-bold mb-6">Contact Us</h1>
    <div v-if="submitted" class="p-6 bg-surface rounded-xl text-center">
      <p class="text-brand text-lg font-semibold mb-2">Message Sent!</p>
      <p class="text-text-secondary">We'll get back to you within 24 hours.</p>
    </div>
    <form v-else @submit.prevent="submit" class="space-y-4">
      <input v-model="form.name" required placeholder="Your Name" class="w-full px-4 py-3 bg-surface-light border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-brand" />
      <input v-model="form.email" required type="email" placeholder="Email" class="w-full px-4 py-3 bg-surface-light border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-brand" />
      <input v-model="form.subject" required placeholder="Subject" class="w-full px-4 py-3 bg-surface-light border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-brand" />
      <textarea v-model="form.message" required rows="5" placeholder="Your message..." class="w-full px-4 py-3 bg-surface-light border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-brand resize-none" />
      <button type="submit" class="w-full py-3 bg-brand hover:bg-brand-dark rounded-lg font-medium transition-colors">Send Message</button>
    </form>
  </div>
</template>
