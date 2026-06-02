<script setup lang="ts">
import type { PostListItem } from '~/types/post'
import { ThumbsUp } from '@lucide/vue'

defineProps<{
  posts: PostListItem[]
}>()
</script>

<template>
  <section v-if="posts.length" class="post-related" aria-labelledby="post-related-heading">
    <h2
      id="post-related-heading"
      class="mb-4 flex items-center gap-2 text-base font-semibold text-foreground"
    >
      <ThumbsUp class="size-4 text-accent" aria-hidden="true" />
      相关文章
    </h2>

    <ul
      class="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li v-for="item in posts" :key="item.id" class="min-h-0">
        <PostCoverLinkCard
          :to="`/post/${item.slug}`"
          :title="item.title"
          :cover="item.cover"
          :published-at="item.publishedAt"
          min-height="9.5rem"
          align="center"
        />
      </li>
    </ul>
  </section>
</template>
