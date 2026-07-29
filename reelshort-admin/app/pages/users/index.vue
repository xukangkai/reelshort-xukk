<script setup lang="ts">
const supabase = useSupabaseClient()
const search = ref('')

const { data: users, refresh } = useAsyncData('admin-users', async () => {
  let q = supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(50)
  if (search.value) q = q.ilike('username', `%${search.value}%`)
  const { data } = await q
  return data || []
})

const banUser = async (u: any) => {
  await supabase.from('profiles').update({ is_banned: !u.is_banned }).eq('id', u.id)
  await refresh()
}

const changeRole = async (u: any, role: string) => {
  await supabase.from('profiles').update({ role }).eq('id', u.id)
  await refresh()
}

watch(search, () => refresh())
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h2 class="text-lg font-bold">用户管理</h2>
      <input v-model="search" placeholder="搜索用户..." class="px-4 py-2 border border-border rounded-lg" />
    </div>
    <div class="bg-white rounded-xl border border-border">
      <table class="w-full">
        <thead class="bg-surface-light"><tr><th class="text-left px-4 py-2 text-xs text-text-muted">用户</th><th class="text-left px-4 py-2 text-xs text-text-muted">邮箱</th><th class="text-left px-4 py-2 text-xs text-text-muted">角色</th><th class="text-left px-4 py-2 text-xs text-text-muted">状态</th><th class="text-left px-4 py-2 text-xs text-text-muted">注册时间</th><th class="text-right px-4 py-2 text-xs text-text-muted">操作</th></tr></thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-t border-border hover:bg-surface-light">
            <td class="px-4 py-3"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-sm">{{ u.username?.[0]?.toUpperCase() || '?' }}</div><span class="font-medium">{{ u.username }}</span></div></td>
            <td class="px-4 py-3 text-text-secondary text-sm">{{ u.id.slice(0, 8) }}...</td>
            <td class="px-4 py-3">
              <select :value="u.role" @change="changeRole(u, ($event.target as HTMLSelectElement).value)" class="text-xs border border-border rounded px-2 py-1">
                <option v-for="r in ['user','admin','editor','viewer']" :key="r" :value="r">{{ r }}</option>
              </select>
            </td>
            <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-xs" :class="u.is_banned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">{{ u.is_banned ? '已封禁' : '正常' }}</span></td>
            <td class="px-4 py-3 text-text-muted text-sm">{{ new Date(u.created_at).toLocaleDateString() }}</td>
            <td class="px-4 py-3 text-right"><button @click="banUser(u)" class="text-sm hover:underline" :class="u.is_banned ? 'text-green-600' : 'text-danger'">{{ u.is_banned ? '解封' : '封禁' }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
