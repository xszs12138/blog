<script setup lang="ts">
import type { ActivityItem } from '~/types/activity'
import { getActivityIcon } from '~/utils/category-icon'
import { cn } from '~/utils/cn'

defineProps<{
  items: ActivityItem[]
  loading?: boolean
}>()
</script>

<template>
  <BaseCard>
    <BaseSectionTitle title="近期动态" />

    <ul
      v-if="loading"
      class="list-none space-y-4 p-0"
      aria-busy="true"
      aria-label="加载近期动态"
    >
      <li v-for="i in 3" :key="i" class="flex gap-3">
        <div class="size-9 shrink-0 animate-pulse rounded-full bg-muted/25" />
        <div class="flex-1 space-y-2 pt-1">
          <div class="h-4 w-4/5 rounded bg-muted/20" />
          <div class="h-3 w-1/3 rounded bg-muted/15" />
        </div>
      </li>
    </ul>

    <p v-else-if="!items.length" class="text-sm text-muted-foreground">
      暂无动态
    </p>

    <ul v-else class="relative list-none space-y-0 p-0">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        class="relative flex gap-3 pb-5 last:pb-0"
      >
        <div
          v-if="index < items.length - 1"
          class="absolute left-[1.125rem] top-10 bottom-0 w-px bg-border"
          aria-hidden="true"
        />
        <span
          :class="cn(
            'relative z-[1] inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-white/5',
            item.type === 'game' && 'text-emerald-400',
            item.type === 'music' && 'text-violet-400',
            item.type === 'post' && 'text-sky-400',
          )"
        >
          <component :is="getActivityIcon(item.type)" class="size-4" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1 pt-0.5">
          <p class="text-sm leading-snug text-foreground">
            <span class="text-muted-foreground">{{ item.title }}</span>
            <template v-if="item.subtitle">
              <span class="text-muted-foreground">: </span>
              <span class="font-medium">{{ item.subtitle }}</span>
            </template>
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            {{ item.timeLabel }}
          </p>
        </div>
      </li>
    </ul>
  </BaseCard>
</template>
