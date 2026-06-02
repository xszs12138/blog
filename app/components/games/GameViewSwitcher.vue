<script setup lang="ts">
import { LayoutGrid, List } from '@lucide/vue'

import { cn } from '~/utils/common/cn'

export type GameViewMode = 'grid' | 'list'

const model = defineModel<GameViewMode>({ default: 'grid' })

const options: { key: GameViewMode, label: string, icon: typeof LayoutGrid }[] = [
  { key: 'grid', label: '网格视图', icon: LayoutGrid },
  { key: 'list', label: '列表视图', icon: List },
]

function buttonClass(key: GameViewMode) {
  return cn(
    'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    model.value === key
      ? 'bg-accent/12 text-[var(--blog-hero-accent)]'
      : 'text-[var(--games-muted)] hover:text-[var(--games-fg)]',
  )
}
</script>

<template>
  <div
    class="inline-flex shrink-0 rounded-xl border border-[var(--games-border)] bg-[var(--games-card-bg)] p-1 shadow-sm"
    role="group"
    aria-label="视图切换"
  >
    <button
      v-for="option in options"
      :key="option.key"
      type="button"
      :class="buttonClass(option.key)"
      :aria-pressed="model === option.key"
      @click="model = option.key"
    >
      <component :is="option.icon" class="size-4" aria-hidden="true" />
      <span class="hidden sm:inline">{{ option.label }}</span>
    </button>
  </div>
</template>
