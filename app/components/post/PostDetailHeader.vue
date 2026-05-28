<script setup lang="ts">
import type { PostDetail } from '~/types/post'
import { Calendar, Clock, Eye } from '@lucide/vue'
import { formatPostDate } from '~/utils/common/format-post-date'
import { formatViewCount } from '~/utils/common/format-view-count'
import { estimateReadingMinutesFromHtml } from '~/utils/post/prepare-post-html'

const props = defineProps<{
  post: PostDetail
  contentHtml?: string
}>()

const dateLabel = computed(() => formatPostDate(props.post.publishedAt))
const readingMinutes = computed(() =>
  estimateReadingMinutesFromHtml(props.contentHtml ?? props.post.summary),
)
const viewsLabel = computed(() => formatViewCount(props.post.viewCount))
</script>

<template>
  <header>
    <div class="flex flex-wrap items-center gap-2.5">
      <NuxtLink v-if="post.category" :to="{ path: '/post', query: { categorySlug: post.category.slug } }"
        class="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
        <PostCategoryBadge :name="post.category.name" :slug="post.category.slug" />
      </NuxtLink>

      <span v-if="post.category" class="hidden h-4 w-px bg-border sm:inline" aria-hidden="true" />

      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
        <span v-if="dateLabel" class="inline-flex items-center gap-1.5">
          <Calendar class="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
          发表于 {{ dateLabel }}
        </span>
        <span class="text-border/80" aria-hidden="true">·</span>
        <span class="inline-flex items-center gap-1.5">
          <Clock class="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
          {{ readingMinutes }} 分钟阅读
        </span>
        <span class="text-border/80" aria-hidden="true">·</span>
        <span class="inline-flex items-center gap-1.5">
          <Eye class="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
          {{ viewsLabel }}
        </span>
      </div>
    </div>

    <h1 class="mt-5 font-heading text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-4xl">
      {{ post.title }}
    </h1>

    <p v-if="post.summary" class="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground md:text-base">
      {{ post.summary }}
    </p>

    <ul v-if="post.tags.length" class="mt-5 flex list-none flex-wrap gap-2 p-0">
      <li v-for="tag in post.tags" :key="tag.id">
        <NuxtLink :to="{ path: '/post', query: { tagSlug: tag.slug } }"
          class="inline-flex rounded-full border border-border bg-white/5 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-accent/35 hover:bg-accent/10 hover:text-foreground">
          {{ tag.name }}
        </NuxtLink>
      </li>
    </ul>
  </header>
</template>
