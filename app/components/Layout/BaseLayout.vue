<script lang="ts" setup>
const props = withDefaults(defineProps<{
  mode?: 'detail' | ''
  /**
   * true：中间主栏随页面滚动（首页文章列表）
   * false：侧栏独立滚动，主栏占满视口高度（详情等页可沿用）
   */
  pageScroll?: boolean
}>(), {
  mode: '',
  pageScroll: false,
})

const { isHeaderVisible } = useHeaderScroll()

const layoutClass = computed(() => {
  if (props.mode === 'detail') {
    return 'md:mt-24 mt-16'
  }
  return ''
})
const layoutStyle = computed(() => ({
  '--aside-top': isHeaderVisible.value ? '6rem' : '1.5rem',
}))
</script>

<template>
  <div class="flex flex-col" :style="layoutStyle" :class="layoutClass">
    <slot name="header" />
    <div
      class="mx-auto w-full max-w-400 px-4 pb-12 sm:px-6 lg:px-10 xl:px-12"
      :class="pageScroll ? '' : 'h-full'"
    >
      <div
        class="flex flex-col gap-6 xl:grid xl:grid-cols-[17rem_minmax(0,1fr)_17rem] xl:items-start xl:gap-8"
        :class="pageScroll ? '' : 'h-full'"
      >
        <div
          class="layout-main order-1 min-w-0 xl:order-2"
          :class="pageScroll ? 'layout-main--page-scroll' : ''"
        >
          <slot name="content" />
        </div>
        <aside
          class="layout-aside order-2 grid gap-6 sm:grid-cols-2 xl:order-1 xl:flex xl:flex-col xl:gap-6 xl:sticky xl:self-start xl:pr-1"
          :class="pageScroll ? 'layout-aside--page-scroll' : 'xl:overflow-y-auto'"
        >
          <HomeProfileCard class="sm:col-span-2 xl:col-span-1" />
          <HomeCategoryList />
          <HomeTagCloud />
        </aside>
        <aside
          class="layout-aside order-3 flex flex-col gap-6 xl:sticky xl:self-start xl:pr-1"
          :class="pageScroll ? 'layout-aside--page-scroll' : 'xl:overflow-y-auto'"
        >
          <slot v-if="$slots.rightSidebar" name="rightSidebar" />
          <template v-else>
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

  .layout-main--page-scroll {
    height: auto;
    max-height: none;
    overflow: visible;
  }

  .layout-aside--page-scroll {
    max-height: none;
    overflow: visible;
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
