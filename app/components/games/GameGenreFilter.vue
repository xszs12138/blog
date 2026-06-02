<script setup lang="ts">
import type { GameGenreItem } from '~/types/game'

import { cn } from '~/utils/common/cn'

const props = defineProps<{
  genres: GameGenreItem[]
  activeSlug?: string
  class?: string
}>()

const emit = defineEmits<{
  select: [slug: string]
}>()

const active = computed(() => props.activeSlug ?? 'all')

function chipClass(slug: string) {
  return cn(
    'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
    active.value === slug
      ? 'border-[var(--games-chip-active-border)] bg-[var(--games-chip-active-bg)] text-[var(--games-chip-active-fg)]'
      : 'border-[var(--games-chip-border)] bg-[var(--games-chip-bg)] text-[var(--games-muted)] hover:border-accent/25 hover:text-[var(--games-fg)]',
  )
}
</script>

<template>
  <div
    :class="cn('flex flex-wrap gap-2', props.class)"
    role="tablist"
    aria-label="游戏类型筛选"
  >
    <button
      v-for="item in genres"
      :key="item.slug"
      type="button"
      role="tab"
      class="cursor-pointer"
      :aria-selected="active === item.slug"
      :class="chipClass(item.slug)"
      @click="emit('select', item.slug)"
    >
      {{ item.name }}
    </button>
  </div>
</template>
