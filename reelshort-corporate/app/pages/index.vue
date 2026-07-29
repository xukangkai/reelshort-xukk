<script setup lang="ts">
useHead({
  title: 'ReelShort | Drama Does Not Wait',
  meta: [
    {
      name: 'description',
      content: 'Discover addictive vertical dramas, original stories, and the ReelShort fandom.',
    },
  ],
})

const activeDrama = ref(0)
const subscribed = ref(false)
const email = ref('')

const dramas = [
  {
    title: 'Love at the Edge',
    genre: 'Forbidden romance',
    episodes: '72 episodes',
    image: 'https://images.pexels.com/photos/30695205/pexels-photo-30695205.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    title: 'The Heiress Returns',
    genre: 'Revenge',
    episodes: '64 episodes',
    image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    title: 'The Alpha Contract',
    genre: 'Fantasy romance',
    episodes: '80 episodes',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    title: 'Fatal Vows',
    genre: 'Romantic thriller',
    episodes: '58 episodes',
    image: 'https://images.pexels.com/photos/3764014/pexels-photo-3764014.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    title: 'Her Second Life',
    genre: 'Comeback drama',
    episodes: '70 episodes',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
]

const fandomStories = [
  {
    kicker: 'Deep dive',
    title: 'Why revenge romances have us completely hooked',
    image: 'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    kicker: 'Cast spotlight',
    title: 'Meet the faces behind this season\'s biggest twists',
    image: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    kicker: 'Watch guide',
    title: 'Five enemies-to-lovers dramas worth losing sleep over',
    image: 'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
]

function moveDrama(direction: number) {
  activeDrama.value = (activeDrama.value + direction + dramas.length) % dramas.length
  document.querySelector(`[data-drama="${activeDrama.value}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  })
}

function subscribe() {
  if (!email.value) return
  subscribed.value = true
}
</script>

<template>
  <div class="overflow-hidden">
    <section class="hero-section">
      <img
        src="https://images.pexels.com/photos/30695205/pexels-photo-30695205.jpeg?auto=compress&cs=tinysrgb&w=2200"
        alt="A couple in a cinematic red-lit scene"
        class="hero-image"
        fetchpriority="high"
      >
      <div class="hero-shade" />

      <div class="relative z-10 mx-auto flex min-h-[92svh] max-w-[1440px] items-end px-4 pb-16 pt-28 sm:px-6 lg:px-10 lg:pb-20">
        <div class="max-w-3xl">
          <p class="eyebrow mb-5">
            <span class="pulse-dot" />
            ReelShort original
          </p>
          <h1 class="display-title text-[clamp(3.7rem,9vw,8.4rem)] leading-[0.82]">
            Drama<br>
            <span class="text-coral">doesn't wait.</span>
          </h1>
          <p class="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            Fall hard. Break hearts. Get even. One addictive minute at a time.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="https://www.reelshort.com" target="_blank" rel="noopener" class="button button-primary">
              <span class="play-symbol" aria-hidden="true">▶</span>
              Watch now
            </a>
            <NuxtLink to="/fandom" class="button button-ghost">
              Explore fandom
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="absolute bottom-5 right-4 z-10 hidden items-center gap-4 text-xs font-bold uppercase text-white/50 sm:flex lg:right-10">
        <span>Scroll for more</span>
        <span class="h-px w-16 bg-white/30" />
      </div>
    </section>

    <section id="watch" class="section-space bg-ink">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div class="mb-8 flex items-end justify-between gap-5">
          <div>
            <p class="section-kicker">Now playing</p>
            <h2 class="section-title mt-2">Your next obsession</h2>
          </div>
          <div class="hidden gap-2 sm:flex">
            <button class="icon-button icon-button-light" type="button" aria-label="Previous drama" @click="moveDrama(-1)">←</button>
            <button class="icon-button icon-button-light" type="button" aria-label="Next drama" @click="moveDrama(1)">→</button>
          </div>
        </div>

        <div class="poster-rail">
          <article
            v-for="(drama, index) in dramas"
            :key="drama.title"
            :data-drama="index"
            class="poster-card group"
            :class="{ 'poster-card-active': activeDrama === index }"
            @mouseenter="activeDrama = index"
          >
            <img :src="drama.image" :alt="drama.title" class="poster-image" loading="lazy">
            <div class="poster-overlay" />
            <div class="absolute inset-x-0 bottom-0 z-10 p-5">
              <p class="text-xs font-bold uppercase text-mint">{{ drama.genre }}</p>
              <h3 class="mt-1 text-2xl font-black leading-tight">{{ drama.title }}</h3>
              <p class="mt-2 text-sm text-white/55">{{ drama.episodes }}</p>
              <a
                href="https://www.reelshort.com"
                target="_blank"
                rel="noopener"
                class="mt-4 inline-flex items-center gap-2 text-sm font-bold opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
              >
                Start watching <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="overflow-hidden bg-coral text-black">
      <div class="statement-track" aria-hidden="true">
        <span>LOVE HARD</span><i>✦</i><span>GET EVEN</span><i>✦</i><span>ONE MORE EPISODE</span><i>✦</i>
      </div>
      <div class="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-24">
        <h2 class="display-title max-w-4xl text-[clamp(3rem,7vw,7rem)] leading-[0.86]">
          Big feelings.<br>Zero waiting.
        </h2>
        <div class="flex max-w-md flex-col justify-end lg:justify-self-end">
          <p class="text-lg font-semibold leading-7 text-black/70">
            Stories built for the way you watch now: vertical, cinematic, and impossible to put down.
          </p>
          <NuxtLink to="/about" class="mt-7 inline-flex items-center gap-2 font-black">
            Meet ReelShort <span aria-hidden="true">↗</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="fandom" class="section-space bg-paper text-black">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div class="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p class="section-kicker text-coral">From the fandom</p>
            <h2 class="section-title mt-2">Go deeper than the finale</h2>
          </div>
          <NuxtLink to="/fandom" class="editorial-link">
            View all stories <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>

        <div class="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <NuxtLink to="/fandom" class="story-feature group">
            <img :src="fandomStories[0].image" :alt="fandomStories[0].title" class="story-image" loading="lazy">
            <div class="story-gradient" />
            <div class="absolute inset-x-0 bottom-0 z-10 p-6 text-white sm:p-8">
              <p class="text-xs font-black uppercase text-mint">{{ fandomStories[0].kicker }}</p>
              <h3 class="mt-2 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">{{ fandomStories[0].title }}</h3>
              <span class="mt-5 inline-flex items-center gap-2 text-sm font-bold">Read story <span aria-hidden="true">→</span></span>
            </div>
          </NuxtLink>

          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <NuxtLink
              v-for="story in fandomStories.slice(1)"
              :key="story.title"
              to="/fandom"
              class="story-row group"
            >
              <img :src="story.image" :alt="story.title" class="h-36 w-32 shrink-0 object-cover sm:h-44 lg:h-full lg:min-h-44" loading="lazy">
              <div class="flex flex-col justify-between p-5">
                <div>
                  <p class="text-xs font-black uppercase text-coral">{{ story.kicker }}</p>
                  <h3 class="mt-2 text-xl font-black leading-tight">{{ story.title }}</h3>
                </div>
                <span class="mt-4 text-sm font-bold">Read <span aria-hidden="true">→</span></span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section-space bg-ink">
      <div class="mx-auto grid max-w-[1440px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
        <div class="relative min-h-[560px]">
          <div class="phone-shell">
            <img
              src="https://images.pexels.com/photos/30695205/pexels-photo-30695205.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="A vertical drama playing in the ReelShort app"
              class="h-full w-full object-cover"
              loading="lazy"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
            <div class="absolute inset-x-0 bottom-0 p-5">
              <p class="text-xs font-bold uppercase text-mint">Episode 21</p>
              <p class="mt-1 text-xl font-black">The truth comes out</p>
              <div class="mt-4 h-1 overflow-hidden bg-white/25">
                <div class="h-full w-2/3 bg-coral" />
              </div>
            </div>
          </div>
          <div class="episode-float episode-float-one">
            <span class="text-coral">01</span>
            One minute to fall in love
          </div>
          <div class="episode-float episode-float-two">
            <span class="text-mint">72</span>
            Episodes to change everything
          </div>
        </div>

        <div class="max-w-xl lg:pl-8">
          <p class="section-kicker">Made for your phone</p>
          <h2 class="section-title mt-3 text-[clamp(2.8rem,6vw,6rem)] leading-[0.9]">Tap.<br>Binge.<br><span class="text-coral">Repeat.</span></h2>
          <p class="mt-7 text-lg leading-8 text-white/60">
            Full-screen vertical stories, rapid-fire episodes, and cliffhangers that land before your next stop.
          </p>
          <div class="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm font-bold text-white/80">
            <span class="flex items-center gap-2"><i class="feature-dot bg-coral" /> New episodes daily</span>
            <span class="flex items-center gap-2"><i class="feature-dot bg-mint" /> Watch anywhere</span>
          </div>
          <NuxtLink to="/download" class="button button-primary mt-9">
            Get ReelShort
            <span aria-hidden="true">↗</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="newsletter-section">
      <div class="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28">
        <p class="section-kicker text-mint">Stay in the loop</p>
        <h2 class="display-title mt-3 text-5xl leading-[0.9] sm:text-7xl">The next twist,<br>in your inbox.</h2>
        <p class="mx-auto mt-6 max-w-xl text-white/60">New releases, cast stories, and fandom favorites. No filler.</p>

        <form v-if="!subscribed" class="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row" @submit.prevent="subscribe">
          <label for="newsletter-email" class="sr-only">Email address</label>
          <input
            id="newsletter-email"
            v-model="email"
            type="email"
            required
            placeholder="Email address"
            class="newsletter-input"
          >
          <button class="button button-primary shrink-0" type="submit">Join the fandom <span aria-hidden="true">→</span></button>
        </form>
        <p v-else class="mx-auto mt-8 max-w-xl border border-mint/40 bg-mint/10 px-5 py-4 font-bold text-mint">
          You're in. The next twist is coming your way.
        </p>
      </div>
    </section>
  </div>
</template>
