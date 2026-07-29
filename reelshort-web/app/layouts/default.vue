<template>
  <div class="min-h-screen flex flex-col">
    <!-- Desktop/Tablet Top Navbar -->
    <LayoutNavbar />

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Desktop Footer -->
    <LayoutFooter class="hidden lg:block" />

    <!-- Mobile Bottom Tab Bar -->
    <LayoutMobileTabBar class="lg:hidden" />

    <!-- App Download Bar -->
    <LayoutDownloadBar />
  </div>
</template>
