<script setup lang="ts">
import type { Component } from 'vue'

import {
  Archive,
  Gamepad2,
  Images,
  List,
  User,
} from '@lucide/vue'
import PostSearchTrigger from '~/components/search/PostSearchTrigger.vue'

interface NavItem {
  label: string
  to: string
  icon: Component
  match: (path: string) => boolean
}

const route = useRoute()

const navItems: NavItem[] = [
  {
    label: '文章',
    to: '/post',
    icon: List,
    match: path => path.startsWith('/post'),
  },
  {
    label: '归档',
    to: '/archive',
    icon: Archive,
    match: path => path.startsWith('/archive'),
  },
  {
    label: '相册',
    to: '/albums',
    icon: Images,
    match: path => path.startsWith('/albums') || path.startsWith('/alums'),
  },
  {
    label: '游戏',
    to: '/games',
    icon: Gamepad2,
    match: path => path.startsWith('/games'),
  },
  // {
  //   label: 'Notes',
  //   to: '/notes',
  //   icon: NotebookPen,
  //   match: path => path.startsWith('/notes'),
  // },
  {
    label: '关于',
    to: '/about',
    icon: User,
    match: path => path.startsWith('/about'),
  },
]

function isActive(item: NavItem) {
  return item.match(route.path)
}
</script>

<template>
  <nav
    class="blog-nav-glass flex items-center justify-between gap-2 rounded-2xl border border-blog-nav-border bg-blog-nav px-3 py-2 sm:gap-4 sm:px-4 sm:py-2.5 md:px-6 md:py-3"
    aria-label="主导航">
    <SiteLogo />

    <ul class="hidden list-none flex-1 items-center justify-center gap-1 p-0 lg:flex lg:gap-2">
      <li v-for="item in navItems" :key="item.to">
        <BaseNavLink :to="item.to" :label="item.label" :icon="item.icon" :active="isActive(item)" />
      </li>
    </ul>

    <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <PostSearchTrigger />
      <BaseIconButton label="切换主题">
        <BaseColorModeButton />
      </BaseIconButton>
    </div>
  </nav>
</template>
