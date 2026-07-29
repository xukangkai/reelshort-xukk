<script setup lang="ts">
useHead({
  title: 'Fandom | ReelShort',
  meta: [
    {
      name: 'description',
      content: 'Cast stories, character guides, watch lists, and deep dives from the world of ReelShort.',
    },
  ],
})

const categories = ['All stories', 'Cast & characters', 'Watch guides', 'Behind the scenes', 'Fan theories']
const activeCategory = ref('All stories')

const stories = [
  {
    category: 'Cast & characters',
    date: 'July 27',
    title: 'Inside the chemistry that made this forbidden romance impossible to pause',
    summary: 'The glances, the power shifts, and the moment everything changed.',
    image: 'https://images.pexels.com/photos/30695205/pexels-photo-30695205.jpeg?auto=compress&cs=tinysrgb&w=1400',
    featured: true,
  },
  {
    category: 'Watch guides',
    date: 'July 26',
    title: 'Five revenge dramas with finales that actually deliver',
    summary: 'Schemes, secrets, and the kind of comeback you will want to replay.',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    category: 'Behind the scenes',
    date: 'July 24',
    title: 'How a one-minute cliffhanger gets built',
    summary: 'A closer look at pacing, performance, and the perfect final frame.',
    image: 'https://images.pexels.com/photos/3379943/pexels-photo-3379943.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    category: 'Fan theories',
    date: 'July 22',
    title: 'The tiny detail everyone missed in episode 34',
    summary: 'That necklace was not just a necklace. Here is what it may mean.',
    image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    category: 'Cast & characters',
    date: 'July 20',
    title: 'Meet the new faces of ReelShort romance',
    summary: 'The breakout stars bringing a fresh charge to this season.',
    image: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    category: 'Watch guides',
    date: 'July 18',
    title: 'Enemies to lovers: where to start',
    summary: 'A spoiler-light path through the most addictive rivalry romances.',
    image: 'https://images.pexels.com/photos/3764014/pexels-photo-3764014.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
]

const filteredStories = computed(() => {
  if (activeCategory.value === 'All stories') return stories
  return stories.filter(story => story.category === activeCategory.value)
})
</script>

<template>
  <div class="bg-paper text-black">
    <section class="fandom-hero">
      <img
        src="https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&cs=tinysrgb&w=2200"
        alt="A cinematic portrait representing the ReelShort fandom"
        class="absolute inset-0 h-full w-full object-cover object-center"
        fetchpriority="high"
      >
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10" />
      <div class="relative z-10 mx-auto flex min-h-[72svh] max-w-[1440px] items-end px-4 pb-14 pt-28 text-white sm:px-6 lg:px-10 lg:pb-20">
        <div class="max-w-3xl">
          <p class="eyebrow mb-5"><span class="pulse-dot" /> ReelShort fandom</p>
          <h1 class="display-title text-[clamp(4.2rem,10vw,9rem)] leading-[0.8]">Stay for<br><span class="text-coral">the obsession.</span></h1>
          <p class="mt-7 max-w-xl text-lg leading-8 text-white/70">
            Cast stories, character guides, watch lists, and the theories keeping everyone up after the finale.
          </p>
        </div>
      </div>
    </section>

    <section class="border-b border-black/10 bg-paper">
      <div class="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-10">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="category-chip"
          :class="{ 'category-chip-active': activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </section>

    <section class="section-space">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div class="mb-10 flex items-end justify-between gap-5">
          <div>
            <p class="section-kicker text-coral">{{ activeCategory }}</p>
            <h2 class="section-title mt-2">Fresh from the feed</h2>
          </div>
          <p class="hidden text-sm font-bold text-black/40 sm:block">{{ filteredStories.length }} stories</p>
        </div>

        <div v-if="activeCategory === 'All stories'" class="mb-12">
          <article class="grid overflow-hidden bg-black text-white lg:grid-cols-[1.2fr_0.8fr]">
            <div class="min-h-[360px] lg:min-h-[560px]">
              <img :src="stories[0].image" :alt="stories[0].title" class="h-full w-full object-cover">
            </div>
            <div class="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <div class="flex items-center gap-3 text-xs font-black uppercase">
                <span class="text-mint">{{ stories[0].category }}</span>
                <span class="text-white/35">{{ stories[0].date }}</span>
              </div>
              <h3 class="mt-5 text-3xl font-black leading-tight sm:text-5xl">{{ stories[0].title }}</h3>
              <p class="mt-5 text-base leading-7 text-white/55">{{ stories[0].summary }}</p>
              <button class="mt-8 inline-flex items-center gap-2 self-start text-sm font-black" type="button">
                Read the story <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        </div>

        <div class="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="story in filteredStories.slice(activeCategory === 'All stories' ? 1 : 0)"
            :key="story.title"
            class="article-card group"
          >
            <div class="article-image-wrap">
              <img :src="story.image" :alt="story.title" class="article-image" loading="lazy">
            </div>
            <div class="mt-5 flex items-center gap-3 text-xs font-black uppercase">
              <span class="text-coral">{{ story.category }}</span>
              <span class="text-black/35">{{ story.date }}</span>
            </div>
            <h3 class="mt-3 text-2xl font-black leading-tight">{{ story.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-black/55">{{ story.summary }}</p>
            <button class="mt-5 inline-flex items-center gap-2 text-sm font-black" type="button">
              Read more <span aria-hidden="true">→</span>
            </button>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-mint text-black">
      <div class="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10 lg:py-20">
        <div>
          <p class="section-kicker">Never miss a twist</p>
          <h2 class="display-title mt-3 max-w-4xl text-[clamp(3rem,7vw,7rem)] leading-[0.86]">Watch it.<br>Talk about it.</h2>
        </div>
        <NuxtLink to="/download" class="button bg-black text-white hover:bg-black/80">
          Get the app <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
