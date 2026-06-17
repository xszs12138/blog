<script setup lang="ts">
import type { PostListItem } from '~/types/post'

defineProps<{
  post: PostListItem
}>()
</script>

<template>
  <article class="group">
    <NuxtLink :to="`/post/${post.slug}`"
      class="blog-card blog-card-interactive relative isolate flex h-56 flex-col gap-2.5 overflow-hidden rounded-2xl border border-border bg-blog-card px-3 py-2 transition-colors hover:border-accent/25 sm:h-60 sm:flex-row sm:gap-4 sm:px-4 sm:py-2">
      <div class="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-muted/20 sm:h-full sm:w-80 md:w-96">
        <img v-if="post.cover" :src="post.cover" :alt="`${post.title} 封面`"
          class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.08] sm:group-hover:scale-[1.15]"
          loading="lazy" decoding="async">
        <div v-else
          class="flex size-full items-center justify-center bg-linear-to-br from-accent/20 via-transparent to-violet-500/10 text-sm text-muted-foreground"
          aria-hidden="true">
          暂无封面
        </div>
        <div v-if="post.category" class="absolute left-2.5 top-2.5 sm:left-3 sm:top-3">
          <PostCategoryBadge :name="post.category.name" :slug="post.category.slug" />
        </div>
      </div>

      <div class="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-2 py-0.5">
        <div class="min-h-0">
          <h3
            class="line-clamp-2 font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent sm:text-lg">
            {{ post.title }}
          </h3>
          <p class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:mt-2">
            {{ post.summary || '暂无摘要' }}
          </p>
        </div>
        <PostMetaRow class="shrink-0" :published-at="post.publishedAt" :summary="post.summary"
          :view-count="post.viewCount" />
      </div>
    </NuxtLink>
  </article>
</template>
