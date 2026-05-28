<script setup lang="ts">
import type { PostListItem } from '~/types/post'
import { formatPostDate } from '~/utils/common/format-post-date'

defineProps<{
  posts: PostListItem[]
}>()
</script>

<template>
  <BaseCard v-if="posts.length" class="p-5">
    <h2 class="mb-4 text-sm font-semibold text-foreground">
      相关文章
    </h2>
    <ul class="list-none space-y-4 p-0">
      <li v-for="item in posts" :key="item.id">
        <NuxtLink
          :to="`/post/${item.slug}`"
          class="group flex gap-3 rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <div
            class="size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/20"
          >
            <img
              v-if="item.cover"
              :src="item.cover"
              :alt="`${item.title} 封面`"
              class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            >
            <div
              v-else
              class="flex size-full items-center justify-center bg-linear-to-br from-accent/15 to-transparent text-[10px] text-muted-foreground"
            >
              无图
            </div>
          </div>
          <div class="min-w-0 flex-1 py-0.5">
            <p class="line-clamp-2 text-sm font-medium leading-snug text-foreground group-hover:text-accent">
              {{ item.title }}
            </p>
            <p
              v-if="formatPostDate(item.publishedAt)"
              class="mt-1 text-xs text-muted-foreground"
            >
              {{ formatPostDate(item.publishedAt) }}
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </BaseCard>
</template>
