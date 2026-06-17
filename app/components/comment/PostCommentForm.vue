<script setup lang="ts">
import type { CreateCommentParams } from '~/types/comment'

import { LoaderCircle, Send } from '@lucide/vue'

import { ApiError } from '~/utils/common/api'
import { normalizeWebsite } from '~/utils/comment/normalize-website'

const props = withDefaults(
  defineProps<{
    slug: string
    parentId?: number | null
    replyTo?: string
    compact?: boolean
  }>(),
  {
    parentId: null,
    replyTo: '',
    compact: false,
  },
)

const emit = defineEmits<{
  submitted: []
  cancel: []
}>()

const { createComment } = useCommentsApi()
const { guest, saveGuest } = useCommentGuest()

const nickname = ref('')
const email = ref('')
const website = ref('')
const content = ref('')
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const isReply = computed(() => props.parentId != null)

const formTitle = computed(() => {
  if (!isReply.value) {
    return '发表评论'
  }
  return props.replyTo ? `回复 ${props.replyTo}` : '回复评论'
})

watch(
  guest,
  (value) => {
    nickname.value = value.nickname
    email.value = value.email
    website.value = value.website
  },
  { immediate: true },
)

function resetContent() {
  content.value = ''
  errorMessage.value = ''
}

function onCancel() {
  resetContent()
  emit('cancel')
}

async function onSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  const trimmedNickname = nickname.value.trim()
  const trimmedContent = content.value.trim()
  const trimmedEmail = email.value.trim()
  const trimmedWebsite = normalizeWebsite(website.value)

  if (!trimmedNickname) {
    errorMessage.value = '请填写昵称'
    return
  }
  if (trimmedNickname.length > 64) {
    errorMessage.value = '昵称最多 64 字'
    return
  }
  if (!trimmedContent) {
    errorMessage.value = '请填写评论内容'
    return
  }
  if (trimmedContent.length > 2000) {
    errorMessage.value = '评论内容最多 2000 字'
    return
  }
  if (trimmedEmail && !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(trimmedEmail)) {
    errorMessage.value = '邮箱格式不正确'
    return
  }

  const payload: CreateCommentParams = {
    nickname: trimmedNickname,
    content: trimmedContent,
    parentId: props.parentId ?? null,
  }
  if (trimmedEmail) {
    payload.email = trimmedEmail
  }
  if (trimmedWebsite) {
    payload.website = trimmedWebsite
  }

  submitting.value = true
  try {
    await createComment(props.slug, payload)
    saveGuest({
      nickname: trimmedNickname,
      email: trimmedEmail,
      website: website.value.trim(),
    })
    resetContent()
    successMessage.value = '评论已提交，审核通过后将显示在下方'
    emit('submitted')
  }
  catch (error) {
    if (error instanceof ApiError) {
      errorMessage.value = error.message || '提交失败，请稍后重试'
    }
    else {
      errorMessage.value = '提交失败，请稍后重试'
    }
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <form
    class="post-comment-form"
    :class="{ 'post-comment-form--compact': compact }"
    @submit.prevent="onSubmit"
  >
    <p v-if="compact" class="post-comment-form__title">
      {{ formTitle }}
    </p>

    <div class="post-comment-form__grid">
      <label class="post-comment-form__field">
        <span class="post-comment-form__label">昵称 <span aria-hidden="true">*</span></span>
        <input
          v-model="nickname"
          type="text"
          name="nickname"
          maxlength="64"
          autocomplete="nickname"
          required
          placeholder="怎么称呼你"
          class="post-comment-form__input"
        >
      </label>

      <label class="post-comment-form__field">
        <span class="post-comment-form__label">邮箱</span>
        <input
          v-model="email"
          type="email"
          name="email"
          maxlength="128"
          autocomplete="email"
          placeholder="可选，不会公开"
          class="post-comment-form__input"
        >
      </label>

      <label class="post-comment-form__field post-comment-form__field--full">
        <span class="post-comment-form__label">网站</span>
        <input
          v-model="website"
          type="url"
          name="website"
          maxlength="512"
          autocomplete="url"
          placeholder="https:// 可选"
          class="post-comment-form__input"
        >
      </label>

      <label class="post-comment-form__field post-comment-form__field--full">
        <span class="post-comment-form__label">评论 <span aria-hidden="true">*</span></span>
        <textarea
          v-model="content"
          name="content"
          rows="4"
          maxlength="2000"
          required
          :placeholder="isReply ? '写下你的回复…' : '友善发言，理性交流…'"
          class="post-comment-form__textarea"
        />
        <span class="post-comment-form__count">{{ content.length }} / 2000</span>
      </label>
    </div>

    <p v-if="errorMessage" class="post-comment-form__message post-comment-form__message--error" role="alert">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage" class="post-comment-form__message post-comment-form__message--success" role="status">
      {{ successMessage }}
    </p>

    <div class="post-comment-form__actions">
      <button
        v-if="compact"
        type="button"
        class="post-comment-form__btn post-comment-form__btn--ghost"
        @click="onCancel"
      >
        取消
      </button>
      <button
        type="submit"
        class="post-comment-form__btn post-comment-form__btn--primary"
        :disabled="submitting"
      >
        <LoaderCircle v-if="submitting" class="size-4 animate-spin" aria-hidden="true" />
        <Send v-else class="size-4" aria-hidden="true" />
        <span>{{ submitting ? '提交中…' : (isReply ? '发表回复' : '发表评论') }}</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.post-comment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-comment-form--compact {
  margin-top: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--blog-border);
  background: rgb(255 255 255 / 3%);
}

:root:not(.dark) .post-comment-form--compact {
  background: rgb(15 20 25 / 3%);
}

.post-comment-form__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--blog-fg);
}

.post-comment-form__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .post-comment-form__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.post-comment-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.post-comment-form__field--full {
  grid-column: 1 / -1;
}

.post-comment-form__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--blog-muted);
}

.post-comment-form__input,
.post-comment-form__textarea {
  width: 100%;
  border-radius: 0.625rem;
  border: 1px solid var(--blog-border);
  background: rgb(255 255 255 / 4%);
  padding: 0.55rem 0.75rem;
  font-size: 0.875rem;
  color: var(--blog-fg);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

:root:not(.dark) .post-comment-form__input,
:root:not(.dark) .post-comment-form__textarea {
  background: #fff;
}

.post-comment-form__input:focus-visible,
.post-comment-form__textarea:focus-visible {
  outline: none;
  border-color: var(--blog-accent);
  box-shadow: 0 0 0 2px rgb(94 233 181 / 25%);
}

.post-comment-form__textarea {
  min-height: 6.5rem;
  resize: vertical;
  line-height: 1.6;
}

.post-comment-form__count {
  align-self: flex-end;
  font-size: 0.75rem;
  color: var(--blog-muted);
}

.post-comment-form__message {
  margin: 0;
  font-size: 0.8125rem;
}

.post-comment-form__message--error {
  color: #e5484d;
}

.post-comment-form__message--success {
  color: var(--blog-accent);
}

.post-comment-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.post-comment-form__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.45rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;
}

.post-comment-form__btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.post-comment-form__btn--primary {
  color: var(--blog-accent-fg);
  background: var(--blog-accent);
}

.post-comment-form__btn--primary:hover:not(:disabled) {
  filter: brightness(1.05);
}

.post-comment-form__btn--primary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgb(94 233 181 / 40%);
}

.post-comment-form__btn--ghost {
  color: var(--blog-muted);
  border-color: var(--blog-border);
  background: transparent;
}

.post-comment-form__btn--ghost:hover {
  color: var(--blog-fg);
  border-color: var(--blog-accent);
}
</style>
