<script setup lang="ts">
const { t } = useI18n()
const { banners, shelves, trending } = useHomeData()
</script>

<template>
  <div>
    <!-- Banner Carousel -->
    <HomeBannerCarousel :banners="banners || []" />

    <!-- Content Shelves -->
    <div class="max-w-7xl mx-auto px-4 space-y-8 mt-8 pb-20 lg:pb-8">
      <!-- Trending Section -->
      <HomeShelfRow v-if="trending?.length" :title="t('home.trending')" :dramas="trending" />

      <!-- Dynamic Shelves from DB -->
      <HomeShelfRow
        v-for="shelf in shelves"
        :key="shelf.id"
        :title="shelf.title"
        :slug="shelf.slug"
        :dramas="(shelf as any).shelf_items?.map((i: any) => i.dramas).filter(Boolean) || []"
      />
    </div>
  </div>
</template>
