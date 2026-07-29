<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const supabase = useSupabaseClient()
const slug = route.params.slug as string

const { data: shelf, error } = await useAsyncData(`shelf-${slug}`, async () => {
  const { data, error } = await supabase
    .from('shelves')
    .select('*, shelf_items(*, dramas:drama_id(*))')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (error) throw createError({ statusCode: 404, message: 'Shelf not found' })
  return data
})

const dramas = computed(() =>
  (shelf.value as any)?.shelf_items
    ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((i: any) => i.dramas)
    .filter(Boolean) || []
)

useHead({
  title: `${shelf.value?.title || 'Shelf'} - ReelShort`,
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8 pb-20 lg:pb-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-text-muted mb-6">
      <NuxtLink to="/" class="hover:text-brand">{{ t('nav.home') }}</NuxtLink>
      <span>/</span>
      <span class="text-white">{{ shelf?.title }}</span>
    </nav>

    <h1 class="text-2xl md:text-3xl font-bold mb-6">{{ shelf?.title }}</h1>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <DramaCard v-for="drama in dramas" :key="drama.id" :drama="drama" />
    </div>

    <div v-if="!dramas.length" class="text-center py-16 text-text-muted">
      <p class="text-lg">No dramas in this shelf yet.</p>
    </div>
  </div>
</template>
