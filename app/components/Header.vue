<script setup lang="ts">
const { isHeaderVisible } = useHeaderScroll()
</script>

<template>
  <header
    class="header-bar pointer-events-none fixed inset-x-0 top-0 z-50"
    :class="{ 'header-bar--hidden': !isHeaderVisible }"
    :inert="!isHeaderVisible || undefined"
  >
    <div
      class="mx-auto w-full max-w-400 px-4 pt-3 sm:px-6 sm:pt-4 lg:px-10 xl:px-12"
      :class="isHeaderVisible ? 'pointer-events-auto' : 'pointer-events-none'"
    >
      <NavBar />
    </div>
  </header>
</template>

<style scoped>
.header-bar {
  transform: translateY(0);
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.header-bar--hidden {
  transform: translateY(calc(-100% - 1.25rem));
  opacity: 0;
  pointer-events: none;
  transition: 0.8s ease;
}

@media (prefers-reduced-motion: reduce) {
  .header-bar {
    transition: none;
  }
}
</style>
