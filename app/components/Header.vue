<script setup lang="ts">
const { isHeaderVisible } = useHeaderScroll()
const { isOpen: isMobileNavOpen } = useMobileNavDrawer()
</script>

<template>
  <header
    class="header-bar pointer-events-none fixed inset-x-0 top-0 z-50"
    :class="{
      'header-bar--hidden': !isHeaderVisible && !isMobileNavOpen,
      'header-bar--drawer-open': isMobileNavOpen,
    }"
    :inert="(!isHeaderVisible && !isMobileNavOpen) || undefined"
  >
    <div
      class="mx-auto w-full max-w-400 px-4 py-2 sm:px-6 sm:py-2.5 lg:px-10 xl:px-10"
      :class="(isHeaderVisible || isMobileNavOpen) ? 'pointer-events-auto' : 'pointer-events-none'"
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

.header-bar--drawer-open {
  z-index: 110;
}

@media (prefers-reduced-motion: reduce) {
  .header-bar {
    transition: none;
  }
}
</style>
