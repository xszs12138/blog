<script setup lang="ts">
import type { CommentItem } from '~/types/comment'

import { LoaderCircle, MessageCircle } from '@lucide/vue'

const props = defineProps<{
  slug: string
}>()

const { getCommentsByPostSlug } = useCommentsApi()

const commentsKey = computed(() => `post-comments-${props.slug}`)

const {
  data: comments,
  pending,
  refresh,
  error,
} = await useAsyncData(
  () => commentsKey.value,
  async () => {
    try {
      return await getCommentsByPostSlug(props.slug)
    }
    catch {
      return [] as CommentItem[]
    }
  },
  {
    watch: [() => props.slug],
    default: () => [] as CommentItem[],
  },
)

const commentCount = computed(() => {
  const list = comments.value ?? []
  return list.reduce((total, item) => total + 1 + item.replies.length, 0)
})

async function onCommentSubmitted() {
  await refresh()
}
</script>

<template>
  <section class="post-comments" aria-labelledby="post-comments-heading">
    <header class="post-comments__header">
      <h2 id="post-comments-heading" class="post-comments__title">
        <MessageCircle class="size-5 shrink-0 text-accent" aria-hidden="true" />
        评论
        <span v-if="commentCount > 0" class="post-comments__count">{{ commentCount }}</span>
      </h2>
      <p class="post-comments__hint">
        欢迎留下想法；新评论需审核后展示。
      </p>
    </header>

    <PostCommentForm
      :slug="slug"
      class="post-comments__form"
      @submitted="onCommentSubmitted"
    />

    <div v-if="pending" class="post-comments__loading" role="status">
      <LoaderCircle class="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
      <span>加载评论中…</span>
    </div>

    <p v-else-if="error" class="post-comments__empty">
      评论加载失败，请刷新页面重试。
    </p>

    <p v-else-if="!(comments?.length)" class="post-comments__empty">
      暂无评论，来抢沙发吧。
    </p>

    <ul v-else class="post-comments__list">
      <li v-for="comment in comments" :key="comment.id">
        <PostCommentItem
          :slug="slug"
          :comment="comment"
          @submitted="onCommentSubmitted"
        />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.post-comments {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.post-comments__header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.post-comments__title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--blog-fg);
}

.post-comments__count {
  display: inline-flex;
  min-width: 1.5rem;
  height: 1.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--blog-accent-fg);
  background: var(--blog-accent);
}

.post-comments__hint {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--blog-muted);
}

.post-comments__form {
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--blog-border);
}

.post-comments__loading,
.post-comments__empty {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 0;
  font-size: 0.875rem;
  color: var(--blog-muted);
}

.post-comments__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
