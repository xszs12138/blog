<script setup lang="ts">
import type { TocItem } from '~/types/toc'
import { cn } from '~/utils/common/cn'

const props = defineProps<{
  items: TocItem[]
  visibleIds: string[]
  activeId: string
}>()

const emit = defineEmits<{
  navigate: [id: string]
}>()

interface NumberedTocItem extends TocItem {
  index: number
}

type TocGroupPosition = 'none' | 'single' | 'start' | 'middle' | 'end'

interface TocRowState {
  item: NumberedTocItem
  inView: boolean
  groupPosition: TocGroupPosition
  isActive: boolean
}

const numberedItems = computed<NumberedTocItem[]>(() =>
  props.items.map((item, index) => ({
    ...item,
    index: index + 1,
  })),
)

const visibleIdSet = computed(() => new Set(props.visibleIds))

const rows = computed<TocRowState[]>(() => {
  const items = numberedItems.value
  const visible = visibleIdSet.value

  return items.map((item, index) => {
    const inView = visible.has(item.id)
    const prevInView = index > 0 && visible.has(items[index - 1]!.id)
    const nextInView = index < items.length - 1 && visible.has(items[index + 1]!.id)

    let groupPosition: TocGroupPosition = 'none'
    if (inView) {
      if (!prevInView && !nextInView) {
        groupPosition = 'single'
      }
      else if (!prevInView && nextInView) {
        groupPosition = 'start'
      }
      else if (prevInView && nextInView) {
        groupPosition = 'middle'
      }
      else {
        groupPosition = 'end'
      }
    }

    return {
      item,
      inView,
      groupPosition,
      isActive: item.id === props.activeId,
    }
  })
})

function rowClass(state: TocRowState) {
  return cn(
    'toc-row',
    state.inView && 'toc-row--in-view',
    state.groupPosition === 'single' && 'toc-row--group-single',
    state.groupPosition === 'start' && 'toc-row--group-start',
    state.groupPosition === 'middle' && 'toc-row--group-middle',
    state.groupPosition === 'end' && 'toc-row--group-end',
  )
}

function bgClass(state: TocRowState) {
  return cn(
    'toc-row__bg',
    state.inView ? 'toc-row__bg--visible' : 'toc-row__bg--hidden',
    state.groupPosition === 'single' && 'toc-row__bg--single',
    state.groupPosition === 'start' && 'toc-row__bg--start',
    state.groupPosition === 'middle' && 'toc-row__bg--middle',
    state.groupPosition === 'end' && 'toc-row__bg--end',
  )
}
</script>

<template>
  <BaseCard v-if="items.length" class="p-5">
    <h2 class="mb-4 text-sm font-semibold text-foreground">
      文章目录
    </h2>
    <ul class="toc-list list-none p-0">
      <li
        v-for="{ item, inView, isActive, groupPosition } in rows"
        :key="item.id"
        :class="cn(rowClass({ item, inView, groupPosition, isActive }), item.level === 3 && 'pl-1')"
      >
        <div
          class="pointer-events-none absolute inset-x-0 inset-y-0"
          aria-hidden="true"
        >
          <div :class="bgClass({ item, inView, groupPosition, isActive })" />
        </div>
        <button
          type="button"
          class="toc-row__btn relative z-1 flex w-full cursor-pointer items-start gap-2 text-left text-sm leading-relaxed"
          :aria-current="isActive ? 'location' : undefined"
          @click="emit('navigate', item.id)"
        >
          <span
            v-if="item.level === 2"
            class="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-medium tabular-nums transition-colors duration-300"
            :class="inView ? 'bg-white/12 text-foreground' : 'bg-black/5 text-muted-foreground dark:bg-white/5'"
            aria-hidden="true"
          >
            {{ item.index }}
          </span>
          <span
            v-else
            class="inline-flex w-6 shrink-0 justify-center pt-0.5 transition-colors duration-300"
            :class="inView ? 'text-foreground/85' : 'text-muted-foreground/70'"
            aria-hidden="true"
          >
            •
          </span>
          <span
            class="min-w-0 flex-1 pt-0.5 transition-[color,font-weight] duration-300"
            :class="inView ? 'font-medium text-foreground' : 'text-muted-foreground'"
          >
            {{ item.text }}
          </span>
        </button>
      </li>
    </ul>
  </BaseCard>
</template>

<style scoped>
.toc-list {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.toc-row {
  position: relative;
  padding: 0 0.25rem;
}

.toc-row--group-middle,
.toc-row--group-end {
  margin-top: -0.125rem;
}

.toc-row__bg {
  position: absolute;
  inset: 0;
  border: 1px solid transparent;
  background: rgb(255 255 255 / 6%);
  opacity: 0;
  transform: scale(0.98);
  transition:
    opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.32s ease,
    border-radius 0.32s ease,
    background-color 0.32s ease;
  will-change: opacity, transform;
}

:root:not(.dark) .toc-row__bg {
  background: rgb(15 20 25 / 4%);
}

.toc-row__bg--visible {
  opacity: 1;
  transform: scale(1);
  border-color: rgb(255 255 255 / 8%);
}

:root:not(.dark) .toc-row__bg--visible {
  border-color: rgb(15 20 25 / 8%);
}

.toc-row__bg--single,
.toc-row__bg--start {
  border-radius: 0.75rem 0.75rem 0 0;
}

.toc-row__bg--single {
  border-radius: 0.75rem;
}

.toc-row__bg--middle {
  border-radius: 0;
  border-top-color: transparent;
  border-bottom-color: transparent;
}

.toc-row__bg--end {
  border-radius: 0 0 0.75rem 0.75rem;
  border-top-color: transparent;
}

.toc-row__btn {
  padding: 0.4rem 0.35rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
}

.toc-row__btn:hover {
  background: rgb(255 255 255 / 4%);
}

@media (prefers-reduced-motion: reduce) {
  .toc-row__bg {
    transition: opacity 0.15s ease;
    transform: none;
  }

  .toc-row__bg--visible {
    transform: none;
  }

  .toc-row__btn span {
    transition: none;
  }
}
</style>
