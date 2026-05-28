<script setup lang="ts">
import type { PostListItem } from '~/types/post'

defineProps<{
  post: PostListItem
}>()
</script>

<template>
  <article class="group">
    <NuxtLink
      :to="`/post/${post.slug}`"
      class="flex flex-col gap-3 rounded-2xl border border-border bg-blog-card p-3 shadow-sm transition-colors hover:border-accent/25 sm:flex-row sm:gap-5 sm:p-5 dark:shadow-black/20"
    >
      <div
        class="relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-xl bg-muted/20 sm:aspect-auto sm:h-full sm:w-72 md:w-80"
      >
        <img
          v-if="post.cover"
          :src="post.cover"
          :alt="`${post.title} 封面`"
          class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.08] sm:group-hover:scale-[1.15]"
          loading="lazy"
          decoding="async"
        >
        <div
          v-else
          class="flex size-full items-center justify-center bg-linear-to-br from-accent/20 via-transparent to-violet-500/10 text-sm text-muted-foreground"
          aria-hidden="true"
        >
          暂无封面
        </div>
        <div v-if="post.category" class="absolute left-2.5 top-2.5 sm:left-3 sm:top-3">
          <PostCategoryBadge :name="post.category.name" :slug="post.category.slug" />
        </div>
      </div>

      <div class="flex min-w-0 flex-1 flex-col justify-between gap-3 py-0.5">
        <div>
          <h3
            class="line-clamp-2 font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent sm:text-lg"
          >
            {{ post.title }}
          </h3>
          <p class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:mt-2">
            {{ post.summary || '暂无摘要' }}
          </p>
        </div>
        <PostMetaRow :published-at="post.publishedAt" :summary="post.summary" :view-count="post.viewCount" />
      </div>
    </NuxtLink>
  </article>
</template>
