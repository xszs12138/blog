<script setup lang="ts">
import type { Component } from 'vue'

import {
  Gamepad2,
  List,
  Moon,
  NotebookPen,
  Search,
  Sun,
  User,
} from '@lucide/vue'

interface NavItem {
  label: string
  to: string
  icon: Component
  match: (path: string) => boolean
}

const route = useRoute()

const navItems: NavItem[] = [
  {
    label: 'Posts',
    to: '/post',
    icon: List,
    match: path => path.startsWith('/post'),
  },
  // {
  //   label: 'Games',
  //   to: '/games',
  //   icon: Gamepad2,
  //   match: path => path.startsWith('/games'),
  // },
  // {
  //   label: 'Notes',
  //   to: '/notes',
  //   icon: NotebookPen,
  //   match: path => path.startsWith('/notes'),
  // },
  // {
  //   label: 'About',
  //   to: '/about',
  //   icon: User,
  //   match: path => path.startsWith('/about'),
  // },
]

function isActive(item: NavItem) {
  return item.match(route.path)
}
</script>

<template>
  <nav
    class="flex items-center justify-between gap-2 rounded-2xl border border-blog-nav-border bg-blog-nav px-3 py-2 shadow-lg shadow-black/10 backdrop-blur-md sm:gap-4 sm:px-4 sm:py-2.5 md:px-6 md:py-3 dark:shadow-black/45"
    aria-label="主导航"
  >
    <SiteLogo />

    <ul class="hidden list-none flex-1 items-center justify-center gap-1 p-0 lg:flex lg:gap-2">
      <li v-for="item in navItems" :key="item.to">
        <BaseNavLink :to="item.to" :label="item.label" :icon="item.icon" :active="isActive(item)" />
      </li>
    </ul>

    <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <BaseIconButton label="搜索">
        <Search class="size-4" aria-hidden="true" />
      </BaseIconButton>
      <BaseIconButton label="切换主题">
        <BaseColorModeButton />
      </BaseIconButton>
    </div>
  </nav>
</template>
