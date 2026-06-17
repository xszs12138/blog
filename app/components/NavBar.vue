<script setup lang="ts">
import NavMobileDrawer from '~/components/nav/NavMobileDrawer.vue'
import NavMobileMenuTrigger from '~/components/nav/NavMobileMenuTrigger.vue'
import PostSearchTrigger from '~/components/search/PostSearchTrigger.vue'
import { navItems } from '~/config/nav-items'

const route = useRoute()

function isActive(match: (path: string) => boolean) {
  return match(route.path)
}
</script>

<template>
  <nav
    class="blog-nav-glass flex items-center gap-2 rounded-2xl border border-blog-nav-border bg-blog-nav px-3 py-1.5 sm:gap-4 sm:px-4 sm:py-2 lg:px-6 lg:py-2.5"
    aria-label="主导航">
    <SiteLogo />

    <div class="hidden list-none flex-1 items-center justify-center gap-1 p-0 lg:ml-3 lg:flex lg:gap-2">
      <div v-for="item in navItems" :key="item.to">
        <BaseNavLink :to="item.to" :label="item.label" :icon="item.icon" :active="isActive(item.match)" />
      </div>
    </div>

    <div class="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
      <NavMobileMenuTrigger />
      <PostSearchTrigger />
      <BaseColorModeButton />
    </div>
  </nav>

  <NavMobileDrawer />
</template>
image.png
