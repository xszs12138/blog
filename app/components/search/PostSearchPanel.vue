<script setup lang="ts">
import { ArrowRight, Loader2, Search, X } from '@lucide/vue'
import { useDebounceFn } from '@vueuse/core'

import { lockBodyScroll } from '~/utils/common/lock-body-scroll'

import type { PostListItem } from '~/types/post'

const SEARCH_PREVIEW_SIZE = 5
const MIN_KEYWORD_LENGTH = 1

const { isOpen, close } = usePostSearchPanel()
const { getPosts } = usePostsApi()

const query = ref('')
const previewItems = ref<PostListItem[]>([])
const previewTotal = ref(0)
const loading = ref(false)

const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

let unlockBodyScroll: (() => void) | null = null

const trimmedQuery = computed(() => query.value.trim())
const hasQuery = computed(() => trimmedQuery.value.length >= MIN_KEYWORD_LENGTH)
const hasResults = computed(() => previewItems.value.length > 0)
const showEmpty = computed(() => hasQuery.value && !loading.value && !hasResults.value)

const panelTitleId = 'post-search-panel-title'
const panelDescId = 'post-search-panel-desc'

const runPreview = useDebounceFn(async (keyword: string) => {
  const value = keyword.trim()
  if (value.length < MIN_KEYWORD_LENGTH) {
    previewItems.value = []
    previewTotal.value = 0
    loading.value = false
    return
  }

  loading.value = true
  try {
    const result = await getPosts({
      page: 1,
      pageSize: SEARCH_PREVIEW_SIZE,
      keyword: value,
    })
    previewItems.value = result.items
    previewTotal.value = result.total
  }
  catch {
    previewItems.value = []
    previewTotal.value = 0
  }
  finally {
    loading.value = false
  }
}, 320)

watch(query, value => runPreview(value))

watch(isOpen, (open) => {
  if (import.meta.client) {
    if (open) {
      unlockBodyScroll = lockBodyScroll()
    }
    else {
      unlockBodyScroll?.()
      unlockBodyScroll = null
    }
  }

  if (!open) {
    query.value = ''
    previewItems.value = []
    previewTotal.value = 0
    loading.value = false
    return
  }

  nextTick(() => {
    inputRef.value?.focus()
  })
})

onBeforeUnmount(() => {
  unlockBodyScroll?.()
  unlockBodyScroll = null
})

function onBackdropClick(event: MouseEvent) {
  if (panelRef.value && !panelRef.value.contains(event.target as Node)) {
    close()
  }
}

function goToFullResults() {
  const value = trimmedQuery.value
  if (!value) {
    return
  }
  close()
  navigateTo({
    path: '/post',
    query: { keyword: value },
  })
}

function openPost(slug: string) {
  close()
  navigateTo(`/post/${slug}`)
}

const isMac = import.meta.client && /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)
const shortcutLabel = computed(() => (isMac ? '⌘K' : 'Ctrl+K'))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="post-search-overlay fixed inset-0 z-[100] flex items-start justify-center px-4 pb-8 pt-[max(5.5rem,12vh)] sm:px-6"
        role="presentation"
        @click="onBackdropClick"
      >
        <div
          class="absolute inset-0 bg-black/55 backdrop-blur-sm dark:bg-black/70"
          aria-hidden="true"
        />

        <div
          ref="panelRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="panelTitleId"
          :aria-describedby="panelDescId"
          class="post-search-panel relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-blog-card shadow-2xl shadow-black/25 dark:shadow-black/50"
          @click.stop
        >
          <h2 :id="panelTitleId" class="sr-only">
            搜索文章
          </h2>
          <p :id="panelDescId" class="sr-only">
            输入关键词搜索标题或摘要，按 Enter 查看全部结果
          </p>

          <div
            class="flex items-center gap-3 border-b border-border px-4 py-3.5 sm:px-5"
          >
            <Search
              class="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />

            <input
              ref="inputRef"
              v-model="query"
              type="search"
              name="post-search"
              autocomplete="off"
              enterkeyhint="search"
              class="post-search-input min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="搜索文章标题或摘要…"
              @keydown.enter.prevent="goToFullResults"
              @keydown.escape.prevent="close"
            >

            <button
              type="button"
              class="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-transparent text-muted-foreground transition-colors hover:border-white/15 hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15"
              :aria-label="`关闭搜索（${shortcutLabel} 可再次打开）`"
              @click="close"
            >
              <X class="size-4" aria-hidden="true" />
            </button>
          </div>

          <div class="max-h-[min(52vh,22rem)] overflow-y-auto overscroll-contain px-2 py-2 sm:px-3">
            <p
              v-if="!hasQuery"
              class="px-3 py-8 text-center text-sm text-muted-foreground"
            >
              输入关键词，将实时匹配已发布文章
            </p>

            <div
              v-else-if="loading && !hasResults"
              class="flex items-center justify-center gap-2 px-3 py-10 text-sm text-muted-foreground"
              aria-live="polite"
            >
              <Loader2 class="size-4 animate-spin" aria-hidden="true" />
              搜索中…
            </div>

            <p
              v-else-if="showEmpty"
              class="px-3 py-8 text-center text-sm text-muted-foreground"
            >
              未找到「{{ trimmedQuery }}」相关文章
            </p>

            <ul v-else-if="hasResults" class="list-none space-y-0.5 p-0">
              <li v-for="post in previewItems" :key="post.id">
                <button
                  type="button"
                  class="group flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15"
                  @click="openPost(post.slug)"
                >
                  <span
                    class="line-clamp-1 font-medium text-foreground group-hover:text-foreground"
                  >
                    {{ post.title }}
                  </span>
                  <span
                    v-if="post.summary"
                    class="line-clamp-1 text-xs text-muted-foreground"
                  >
                    {{ post.summary }}
                  </span>
                </button>
              </li>
            </ul>
          </div>

          <footer
            class="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-5"
          >
            <span class="hidden sm:inline">
              <kbd class="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-[10px]">{{ shortcutLabel }}</kbd>
              打开搜索
            </span>
            <span class="sm:hidden">
              按 Enter 查看全部
            </span>

            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-border bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-white/20 hover:bg-white/8 disabled:pointer-events-none disabled:opacity-40"
              :disabled="!hasQuery"
              @click="goToFullResults"
            >
              <template v-if="previewTotal > previewItems.length">
                查看全部 {{ previewTotal }} 篇
              </template>
              <template v-else>
                查看全部结果
              </template>
              <ArrowRight class="size-3.5" aria-hidden="true" />
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.post-search-input {
  box-shadow: none;
}

.post-search-input:focus {
  outline: none;
  box-shadow: none;
}

.post-search-input:focus-visible {
  outline: none;
  box-shadow: none;
}

/* WebKit 搜索框默认聚焦环 */
.post-search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

@media (prefers-reduced-motion: reduce) {
  .post-search-overlay :deep(.transition) {
    transition: none !important;
  }
}
</style>
