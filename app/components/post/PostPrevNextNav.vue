<script setup lang="ts">
import type { PostNeighbor } from '~/types/post'

defineProps<{
  prevPost?: PostNeighbor
  nextPost?: PostNeighbor
}>()
</script>

<template>
  <nav
    class="post-prev-next grid w-full grid-cols-2 gap-3 overflow-hidden sm:gap-0 sm:rounded-xl"
    aria-label="上一篇下一篇"
  >
    <div class="min-w-0">
      <PostCoverLinkCard
        v-if="prevPost"
        :to="`/post/${prevPost.slug}`"
        :title="prevPost.title"
        :cover="prevPost.cover"
        :published-at="prevPost.publishedAt"
        label="上一篇"
        align="left"
        min-height="10rem"
      />
      <div
        v-else
        class="min-h-40 rounded-xl bg-muted/10 sm:min-h-40 sm:rounded-none sm:rounded-l-xl"
        aria-hidden="true"
      />
    </div>

    <div class="min-w-0">
      <PostCoverLinkCard
        v-if="nextPost"
        :to="`/post/${nextPost.slug}`"
        :title="nextPost.title"
        :cover="nextPost.cover"
        :published-at="nextPost.publishedAt"
        label="下一篇"
        align="right"
        min-height="10rem"
      />
      <div
        v-else
        class="min-h-40 rounded-xl bg-muted/10 sm:min-h-40 sm:rounded-none sm:rounded-r-xl"
        aria-hidden="true"
      />
    </div>
  </nav>
</template>

<style scoped>
.post-prev-next :deep(.post-cover-card) {
  width: 100%;
  border-radius: 0.75rem;
}

@media (min-width: 640px) {
  .post-prev-next > div:first-child :deep(.post-cover-card) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .post-prev-next > div:last-child :deep(.post-cover-card) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .post-prev-next > div:last-child :deep(.post-cover-card) {
    box-shadow: inset 1px 0 0 rgb(255 255 255 / 8%);
  }
}
</style>
