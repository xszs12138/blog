<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { cn } from '~/utils/common/cn'

const props = withDefaults(
  defineProps<{
    page: number
    totalPages: number
    ariaLabel?: string
  }>(),
  {
    ariaLabel: '文章分页',
  },
)

const emit = defineEmits<{
  'update:page': [page: number]
}>()

function goTo(page: number) {
  const next = Math.min(props.totalPages, Math.max(1, page))
  if (next !== props.page) {
    emit('update:page', next)
  }
}

const pageItems = computed(() => {
  const { page, totalPages } = props

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({ type: 'page' as const, value: i + 1 }))
  }

  if (page <= 4) {
    return [
      ...Array.from({ length: 5 }, (_, i) => ({ type: 'page' as const, value: i + 1 })),
      { type: 'ellipsis' as const },
      { type: 'page' as const, value: totalPages },
    ]
  }

  if (page >= totalPages - 3) {
    return [
      { type: 'page' as const, value: 1 },
      { type: 'ellipsis' as const },
      ...Array.from({ length: 5 }, (_, i) => ({
        type: 'page' as const,
        value: totalPages - 4 + i,
      })),
    ]
  }

  return [
    { type: 'page' as const, value: 1 },
    { type: 'ellipsis' as const },
    { type: 'page' as const, value: page - 1 },
    { type: 'page' as const, value: page },
    { type: 'page' as const, value: page + 1 },
    { type: 'ellipsis' as const },
    { type: 'page' as const, value: totalPages },
  ]
})

function itemClass(isActive: boolean, isNav = false) {
  return cn(
    'pagination-item',
    isNav && 'pagination-item--nav',
    isActive && 'pagination-item--active',
  )
}
</script>

<template>
  <nav class="pagination" :aria-label="ariaLabel">
    <div class="pagination__track">
      <button
        type="button"
        :class="itemClass(false, true)"
        :disabled="page <= 1"
        aria-label="上一页"
        @click="goTo(page - 1)"
      >
        <ChevronLeft class="size-4" aria-hidden="true" />
      </button>

      <template v-for="(item, index) in pageItems" :key="`${item.type}-${item.value ?? index}`">
        <span
          v-if="item.type === 'ellipsis'"
          class="pagination-ellipsis"
          aria-hidden="true"
        >
          …
        </span>
        <button
          v-else
          type="button"
          :class="itemClass(item.value === page)"
          :aria-current="item.value === page ? 'page' : undefined"
          @click="goTo(item.value!)"
        >
          {{ item.value }}
        </button>
      </template>

      <button
        type="button"
        :class="itemClass(false, true)"
        :disabled="page >= totalPages"
        aria-label="下一页"
        @click="goTo(page + 1)"
      >
        <ChevronRight class="size-4" aria-hidden="true" />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  width: 100%;
}

.pagination__track {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  max-width: 100%;
  padding: 0.25rem 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.pagination__track::-webkit-scrollbar {
  display: none;
}

.pagination-item,
.pagination-ellipsis {
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.pagination-item {
  border: 1px solid var(--pagination-item-border);
  background: transparent;
  color: var(--pagination-item-fg);
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.pagination-item--nav {
  border-color: transparent;
}

.pagination-item:not(:disabled):hover {
  border-color: var(--pagination-item-border-hover);
  color: var(--pagination-item-fg-hover);
}

.pagination-item--nav:not(:disabled):hover {
  border-color: transparent;
}

.pagination-item:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--pagination-focus-ring);
}

.pagination-item:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.pagination-item--active {
  border-color: var(--pagination-active-border);
  color: var(--pagination-active-fg);
}

.pagination-item--active:hover {
  border-color: var(--pagination-active-border);
  color: var(--pagination-active-fg);
}

.pagination-ellipsis {
  border: 1px solid transparent;
  background: transparent;
  color: var(--pagination-item-fg);
  user-select: none;
}

.pagination {
  --pagination-item-border: rgb(255 255 255 / 10%);
  --pagination-item-border-hover: rgb(255 255 255 / 18%);
  --pagination-item-fg: rgb(242 244 246 / 55%);
  --pagination-item-fg-hover: rgb(242 244 246 / 88%);
  --pagination-active-border: rgb(136 192 150 / 55%);
  --pagination-active-fg: #88c096;
  --pagination-focus-ring: rgb(136 192 150 / 45%);
}

:root:not(.dark) .pagination {
  --pagination-item-border: rgb(15 20 25 / 12%);
  --pagination-item-border-hover: rgb(15 20 25 / 20%);
  --pagination-item-fg: rgb(15 20 25 / 50%);
  --pagination-item-fg-hover: rgb(15 20 25 / 82%);
  --pagination-active-border: rgb(34 160 107 / 45%);
  --pagination-active-fg: #2d8a5e;
  --pagination-focus-ring: rgb(34 160 107 / 35%);
}
</style>
