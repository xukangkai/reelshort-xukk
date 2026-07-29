import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import supabase from '@/utils/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const displayName = computed(() => user.value?.user_metadata?.username || user.value?.email || '')

  async function init() {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      user.value = session.user
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null
    })
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } finally {
      loading.value = false
    }
  }

  async function signup(email: string, password: string, username: string) {
    loading.value = true
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      })
      if (error) throw error
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, loading, isLoggedIn, displayName, init, login, signup, logout }
})
