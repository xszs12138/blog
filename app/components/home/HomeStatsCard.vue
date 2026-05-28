<script setup lang="ts">
import type { Component } from 'vue'
import { FileText, FolderClosed, Tag } from '@lucide/vue'

interface StatItem {
  key: string
  label: string
  value: number
  icon: Component
}

const { data } = await useHomeProfile()

const stats = computed<StatItem[]>(() => {
  const { postCount, categoryCount, tagCount } = data.value?.stats ?? {
    postCount: 0,
    categoryCount: 0,
    tagCount: 0,
  }
  return [
    { key: 'posts', label: '文章', value: postCount, icon: FileText },
    { key: 'categories', label: '分类', value: categoryCount, icon: FolderClosed },
    { key: 'tags', label: '标签', value: tagCount, icon: Tag },
  ]
})

function formatValue(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}
</script>

<template>
  <BaseCard title="站点统计">
    <ul class="list-none space-y-0.5 p-0" role="list" aria-label="站点统计">
      <li v-for="item in stats" :key="item.key" class="flex items-center gap-3 rounded-lg px-1 py-2">
        <span
          class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
          aria-hidden="true"
        >
          <component :is="item.icon" class="size-4" />
        </span>
        <span class="flex-1 truncate text-sm text-muted-foreground">
          {{ item.label }}
        </span>
        <span class="font-heading text-sm font-semibold tabular-nums text-foreground">
          {{ formatValue(item.value) }}
        </span>
      </li>
    </ul>
  </BaseCard>
</template>
