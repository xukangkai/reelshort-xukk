<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
if (user.value) navigateTo('/')

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
  if (err) error.value = err.message
  else navigateTo('/')
  loading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-bg">
    <div class="w-full max-w-sm bg-white rounded-xl p-8 shadow-lg border border-border">
      <h1 class="text-2xl font-bold text-center mb-1">ReelShort 管理后台</h1>
      <p class="text-text-muted text-center text-sm mb-6">登录您的账户</p>

      <div v-if="error" class="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{{ error }}</div>

      <div class="space-y-3">
        <input v-model="email" type="email" placeholder="邮箱" class="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand" />
        <input v-model="password" type="password" placeholder="密码" class="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand" @keyup.enter="handleLogin" />
        <button @click="handleLogin" :disabled="loading" class="w-full py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50">
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </div>
    </div>
  </div>
</template>
