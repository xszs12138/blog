<script lang="ts" setup>
const { isHeaderVisible } = useHeaderScroll()

const layoutStyle = computed(() => ({
  '--aside-top': isHeaderVisible.value ? '6rem' : '1.5rem',
}))
</script>

<template>
  <div class="flex flex-col" :style="layoutStyle">
    <slot name="header" />
    <div class="mx-auto w-full max-w-400 px-4 pb-12 sm:px-6 lg:px-10 xl:px-12 h-full">
      <div class="flex flex-col gap-6 xl:grid xl:grid-cols-[17rem_minmax(0,1fr)_17rem] xl:items-start xl:gap-8 h-full">
        <div class="order-1 min-w-0 xl:order-2">
          <slot name="content" />
        </div>
        <aside
          class="layout-aside order-2 grid gap-6 sm:grid-cols-2 xl:order-1 xl:flex xl:flex-col xl:gap-6 xl:sticky xl:self-start xl:overflow-y-auto xl:pr-1">
          <HomeProfileCard class="sm:col-span-2 xl:col-span-1" />
          <HomeCategoryList />
          <HomeTagCloud />
        </aside>
        <aside class="layout-aside order-3 flex flex-col gap-6 xl:sticky xl:self-start xl:overflow-y-auto xl:pr-1">
          <slot v-if="$slots.rightSidebar" name="rightSidebar" />
          <template v-else>
            <HomeMusicPlayer class="sm:col-span-2 xl:col-span-1" />
            <HomeStatsCard class="sm:col-span-2 xl:col-span-1" />
          </template>
        </aside>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<style scoped>
@media (min-width: 1280px) {
  .layout-aside {
    top: var(--aside-top, 6rem);
    max-height: calc(100svh - var(--aside-top, 6rem) - 1.5rem);
    transition:
      top 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }
}

.layout-aside {
  scrollbar-width: thin;
  scrollbar-color: rgb(255 255 255 / 12%) transparent;
}

.layout-aside::-webkit-scrollbar {
  width: 4px;
}

.layout-aside::-webkit-scrollbar-thumb {
  background-color: rgb(255 255 255 / 12%);
  border-radius: 999px;
}

.layout-aside::-webkit-scrollbar-thumb:hover {
  background-color: rgb(255 255 255 / 22%);
}

:root:not(.dark) .layout-aside {
  scrollbar-color: rgb(15 20 25 / 18%) transparent;
}

:root:not(.dark) .layout-aside::-webkit-scrollbar-thumb {
  background-color: rgb(15 20 25 / 18%);
}

:root:not(.dark) .layout-aside::-webkit-scrollbar-thumb:hover {
  background-color: rgb(15 20 25 / 30%);
}

@media (prefers-reduced-motion: reduce) {
  .layout-aside {
    transition: none;
  }
}
</style>
