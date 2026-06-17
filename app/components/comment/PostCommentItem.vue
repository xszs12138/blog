<script setup lang="ts">
import type { CommentItem, CommentReply } from '~/types/comment'

import { MessageSquareReply } from '@lucide/vue'

import { formatCommentDate } from '~/utils/comment/format-comment-date'

const props = defineProps<{
  slug: string
  comment: CommentItem
}>()

const emit = defineEmits<{
  submitted: []
}>()

const replying = ref(false)

function toggleReply() {
  replying.value = !replying.value
}

function onReplySubmitted() {
  replying.value = false
  emit('submitted')
}

function authorLink(item: CommentItem | CommentReply) {
  const website = item.website?.trim()
  if (!website) {
    return null
  }
  return website
}
</script>

<template>
  <article class="post-comment-item">
    <div class="post-comment-item__main">
      <PostCommentAvatar :nickname="comment.nickname" />

      <div class="post-comment-item__body">
        <header class="post-comment-item__header">
          <div class="post-comment-item__meta">
            <a
              v-if="authorLink(comment)"
              :href="authorLink(comment)!"
              class="post-comment-item__name post-comment-item__name--link"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {{ comment.nickname }}
            </a>
            <span v-else class="post-comment-item__name">{{ comment.nickname }}</span>
            <time class="post-comment-item__time" :datetime="comment.createdAt">
              {{ formatCommentDate(comment.createdAt) }}
            </time>
          </div>

          <button
            type="button"
            class="post-comment-item__reply-btn"
            :aria-expanded="replying"
            @click="toggleReply"
          >
            <MessageSquareReply class="size-3.5" aria-hidden="true" />
            {{ replying ? '收起' : '回复' }}
          </button>
        </header>

        <p class="post-comment-item__content">
          {{ comment.content }}
        </p>

        <PostCommentForm
          v-if="replying"
          :slug="slug"
          :parent-id="comment.id"
          :reply-to="comment.nickname"
          compact
          @submitted="onReplySubmitted"
          @cancel="replying = false"
        />
      </div>
    </div>

    <ul v-if="comment.replies.length" class="post-comment-item__replies">
      <li v-for="reply in comment.replies" :key="reply.id" class="post-comment-item__reply">
        <PostCommentAvatar :nickname="reply.nickname" />

        <div class="post-comment-item__body">
          <header class="post-comment-item__header">
            <div class="post-comment-item__meta">
              <a
                v-if="authorLink(reply)"
                :href="authorLink(reply)!"
                class="post-comment-item__name post-comment-item__name--link"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                {{ reply.nickname }}
              </a>
              <span v-else class="post-comment-item__name">{{ reply.nickname }}</span>
              <time class="post-comment-item__time" :datetime="reply.createdAt">
                {{ formatCommentDate(reply.createdAt) }}
              </time>
            </div>
          </header>

          <p class="post-comment-item__content">
            {{ reply.content }}
          </p>
        </div>
      </li>
    </ul>
  </article>
</template>

<style scoped>
.post-comment-item {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--blog-border);
}

.post-comment-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.post-comment-item__main,
.post-comment-item__reply {
  display: flex;
  gap: 0.75rem;
}

.post-comment-item__body {
  min-width: 0;
  flex: 1;
}

.post-comment-item__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.post-comment-item__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.65rem;
}

.post-comment-item__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--blog-fg);
}

.post-comment-item__name--link {
  color: var(--blog-accent);
  text-decoration: none;
}

.post-comment-item__name--link:hover {
  text-decoration: underline;
}

.post-comment-item__time {
  font-size: 0.75rem;
  color: var(--blog-muted);
}

.post-comment-item__reply-btn {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.25rem;
  border: none;
  background: transparent;
  font-size: 0.75rem;
  color: var(--blog-muted);
  cursor: pointer;
  transition: color 0.2s ease;
}

.post-comment-item__reply-btn:hover {
  color: var(--blog-accent);
}

.post-comment-item__reply-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgb(94 233 181 / 35%);
  border-radius: 0.25rem;
}

.post-comment-item__content {
  margin: 0.45rem 0 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--blog-fg);
}

.post-comment-item__replies {
  margin: 0 0 0 2.75rem;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

@media (max-width: 639px) {
  .post-comment-item__replies {
    margin-left: 0;
    padding-left: 0.75rem;
    border-left: 2px solid var(--blog-border);
  }
}
</style>
