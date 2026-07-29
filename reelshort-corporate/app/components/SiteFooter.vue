<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-white/10 bg-black">
    <div class="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div class="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <BrandLogo />
          <p class="mt-4 max-w-sm text-sm leading-6 text-white/50">
            Big feelings, bold twists, and stories made to move at the speed of life.
          </p>
          <div class="mt-6 flex gap-2">
            <a class="social-link" href="https://www.instagram.com/reelshortapp" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
            <a class="social-link" href="https://www.tiktok.com/@reelshortapp" target="_blank" rel="noopener" aria-label="TikTok">TT</a>
            <a class="social-link" href="https://www.youtube.com/@reelshortapp" target="_blank" rel="noopener" aria-label="YouTube">YT</a>
            <a class="social-link" href="https://www.facebook.com/ReelShortTV" target="_blank" rel="noopener" aria-label="Facebook">FB</a>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p class="footer-label">Discover</p>
            <NuxtLink class="footer-link" to="/#watch">Watch</NuxtLink>
            <NuxtLink class="footer-link" to="/fandom">Fandom</NuxtLink>
            <NuxtLink class="footer-link" to="/download">Download</NuxtLink>
          </div>
          <div>
            <p class="footer-label">Company</p>
            <NuxtLink class="footer-link" to="/about">About</NuxtLink>
            <NuxtLink class="footer-link" to="/press">Press</NuxtLink>
            <NuxtLink class="footer-link" to="/contact">Contact</NuxtLink>
          </div>
          <div>
            <p class="footer-label">Legal</p>
            <NuxtLink class="footer-link" to="/privacy">Privacy</NuxtLink>
            <NuxtLink class="footer-link" to="/terms">Terms</NuxtLink>
          </div>
        </div>
      </div>

      <div class="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ year }} ReelShort. All rights reserved.</p>
        <p>Every second is drama.</p>
      </div>
    </div>
  </footer>
</template>
