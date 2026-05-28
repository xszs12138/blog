<script setup lang="ts">
import type { ActivityItem } from '~/types/activity'
import { getActivityIcon } from '~/utils/category/category-icon'
import { cn } from '~/utils/common/cn'

defineProps<{
  items: ActivityItem[]
  loading?: boolean
}>()
</script>

<template>
  <BaseCard title="近期动态">
    <ul class="relative list-none space-y-0 p-0">
      <li v-for="(item, index) in items" :key="item.id" class="relative flex gap-3 pb-5 last:pb-0">
        <div v-if="index < items.length - 1" class="absolute left-4.5 top-10 bottom-0 w-px bg-border"
          aria-hidden="true" />
        <span :class="cn(
          'relative z-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-white/5',
          item.type === 'game' && 'text-emerald-400',
          item.type === 'music' && 'text-violet-400',
          item.type === 'post' && 'text-sky-400',
        )">
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
