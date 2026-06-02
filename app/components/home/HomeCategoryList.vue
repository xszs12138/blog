<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import { getCategoryIcon } from '~/utils/category/category-icon'
import { getCategoryTone } from '~/utils/category/category-style'
import { cn } from '~/utils/common/cn'

const { data } = await useHomeSidebar()

const categories = computed(() => data.value?.categories ?? [])
</script>

<template>
  <BaseCard title="分类">
    <p v-if="!categories.length" class="text-sm text-muted-foreground">
      暂无分类
    </p>

    <ul v-else class="list-none space-y-1 p-0">
      <li v-for="item in categories" :key="item.id">
        <NuxtLink
          :to="{ path: '/post', query: { categorySlug: item.slug } }"
          class="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[var(--blog-surface-hover)]"
        >
          <span :class="cn(
            'inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--blog-surface-muted)]',
            getCategoryTone(item.slug, item.name).icon,
          )"
          >
            <component :is="getCategoryIcon(item.slug, item.name)" class="size-4" aria-hidden="true" />
          </span>
          <span class="min-w-0 flex-1 truncate text-sm text-foreground">
            {{ item.name }}
          </span>
          <span class="shrink-0 text-xs tabular-nums text-muted-foreground">
            {{ item.postCount }}
          </span>
          <ChevronRight
            class="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </NuxtLink>
      </li>
    </ul>
  </BaseCard>
</template>
