<script setup lang="ts">
const { t } = useI18n()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

if (user.value) navigateTo('/profile')

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const isSignUp = ref(false)
const username = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (err) error.value = err.message
    else navigateTo('/profile')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const handleSignUp = async () => {
  loading.value = true
  error.value = ''
  try {
    const { error: err } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: { data: { username: username.value } },
    })
    if (err) error.value = err.message
    else navigateTo('/profile')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/confirm' },
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-brand">ReelShort</h1>
        <p class="text-text-secondary mt-2">{{ isSignUp ? t('login.createAccount') : t('login.welcomeBack') }}</p>
      </div>

      <div class="bg-surface rounded-xl p-6 space-y-4">
        <div v-if="error" class="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {{ error }}
        </div>

        <input
          v-if="isSignUp"
          v-model="username"
          type="text"
          :placeholder="t('login.username')"
          class="w-full px-4 py-3 bg-surface-light border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-brand"
        />
        <input
          v-model="email"
          type="email"
          :placeholder="t('login.email')"
          class="w-full px-4 py-3 bg-surface-light border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-brand"
        />
        <input
          v-model="password"
          type="password"
          :placeholder="t('login.password')"
          class="w-full px-4 py-3 bg-surface-light border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-brand"
          @keyup.enter="isSignUp ? handleSignUp() : handleLogin()"
        />

        <button
          @click="isSignUp ? handleSignUp() : handleLogin()"
          :disabled="loading"
          class="w-full py-3 bg-brand hover:bg-brand-dark disabled:opacity-50 rounded-lg font-medium transition-colors"
        >
          {{ loading ? t('login.loading') : (isSignUp ? t('login.signUp') : t('login.signIn')) }}
        </button>

        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-border" /></div>
          <div class="relative flex justify-center text-xs"><span class="bg-surface px-2 text-text-muted">{{ t('login.or') }}</span></div>
        </div>

        <button @click="handleGoogleLogin" class="w-full py-3 bg-surface-light hover:bg-surface-lighter border border-border rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {{ t('login.continueGoogle') }}
        </button>

        <p class="text-center text-sm text-text-secondary">
          {{ isSignUp ? t('login.hasAccount') : t('login.noAccount') }}
          <button @click="isSignUp = !isSignUp" class="text-brand hover:underline">
            {{ isSignUp ? t('login.signIn') : t('login.signUp') }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
