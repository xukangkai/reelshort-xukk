<script setup lang="ts">
const supabase = useSupabaseClient()

onMounted(async () => {
  // Handle OAuth callback
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    navigateTo('/profile')
  } else {
    navigateTo('/login')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p class="text-text-secondary">Signing in...</p>
    </div>
  </div>
</template>
