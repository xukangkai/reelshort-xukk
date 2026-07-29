<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()
const slug = route.params.slug as string

const sortBy = ref('trending')
const page = ref(1)
const perPage = 20

// Fetch category info
const { data: category } = await useAsyncData(`category-${slug}`, async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (error) throw createError({ statusCode: 404, message: 'Category not found' })
  return data
})

useHead({
  title: `${category.value?.name || 'Category'} - ReelShort`,
  meta: [
    { name: 'description', content: category.value?.description || `Browse ${category.value?.name} dramas` },
  ],
})

// Fetch dramas in category
const { data: dramas, refresh } = useAsyncData(`category-dramas-${slug}-${sortBy.value}-${page.value}`, async () => {
  let query = supabase
    .from('drama_categories')
    .select('dramas(*)')
    .eq('category_id', category.value!.id)
    .eq('dramas.status', 'published')
    .range((page.value - 1) * perPage, page.value * perPage - 1)

  if (sortBy.value === 'trending') query = query.order('dramas(trending_score)', { ascending: false } as any)
  else if (sortBy.value === 'newest') query = query.order('dramas(release_date)', { ascending: false } as any)
  else if (sortBy.value === 'rating') query = query.order('dramas(rating)', { ascending: false } as any)

  const { data } = await query
  return (data as any[])?.map(d => d.dramas).filter(Boolean) || []
}, { watch: [sortBy, page] })

const sortOptions = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8 pb-20 lg:pb-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-text-muted mb-6">
      <NuxtLink to="/" class="hover:text-brand">Home</NuxtLink>
      <span>/</span>
      <NuxtLink to="/category" class="hover:text-brand">Categories</NuxtLink>
      <span>/</span>
      <span class="text-white">{{ category?.name }}</span>
    </nav>

    <!-- Category Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold">{{ category?.name }}</h1>
      <p v-if="category?.description" class="text-text-secondary mt-2">{{ category.description }}</p>
    </div>

    <!-- Sort & Filter -->
    <div class="flex items-center gap-3 mb-6">
      <span class="text-sm text-text-muted">Sort by:</span>
      <div class="flex gap-2">
        <button
          v-for="opt in sortOptions" :key="opt.value"
          @click="sortBy = opt.value; page = 1"
          class="px-3 py-1.5 rounded-full text-sm transition-colors"
          :class="sortBy === opt.value ? 'bg-brand text-white' : 'bg-surface-light text-text-secondary hover:bg-surface-lighter'"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Drama Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <DramaCard
        v-for="drama in dramas"
        :key="drama.id"
        :drama="drama"
      />
    </div>

    <div v-if="!dramas?.length" class="text-center py-16 text-text-muted">
      <p class="text-lg">No dramas in this category yet.</p>
    </div>

    <!-- Pagination -->
    <div v-if="dramas && dramas.length >= perPage" class="flex justify-center mt-8">
      <button @click="page++" class="px-5 py-2 bg-surface-light hover:bg-surface-lighter rounded-lg text-sm">
        Load More
      </button>
    </div>
  </div>
</template>
