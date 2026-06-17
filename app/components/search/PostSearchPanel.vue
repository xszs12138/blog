<script setup lang="ts">
import type { ModalProps } from 'antdv-next'
import type { PostListItem } from '~/types/post'

import { ArrowRight, Search, X } from '@lucide/vue'
import { useDebounceFn } from '@vueuse/core'

const SEARCH_PREVIEW_SIZE = 5
const MIN_KEYWORD_LENGTH = 1

const { isOpen, open, close } = usePostSearchPanel()
const { getPosts } = usePostsApi()

const query = ref('')
const previewItems = ref<PostListItem[]>([])
const previewTotal = ref(0)
const loading = ref(false)

const inputRef = ref<{ focus?: () => void } | null>(null)

const trimmedQuery = computed(() => query.value.trim())
const hasQuery = computed(() => trimmedQuery.value.length >= MIN_KEYWORD_LENGTH)
const hasResults = computed(() => previewItems.value.length > 0)
const showEmpty = computed(() => hasQuery.value && !loading.value && !hasResults.value)

const panelTitleId = 'post-search-panel-title'
const panelDescId = 'post-search-panel-desc'
const modalOpen = computed({
  get: () => isOpen.value,
  set: value => (value ? open() : close()),
})

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
  if (!open) {
    query.value = ''
    previewItems.value = []
    previewTotal.value = 0
    loading.value = false
    return
  }

  nextTick(() => {
    inputRef.value?.focus?.()
  })
})

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

const stylesFn: ModalProps['styles'] = {
  container: {
    padding: '0',
  },
}

const isMac = import.meta.client && /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)
const shortcutLabel = computed(() => (isMac ? '⌘K' : 'Ctrl+K'))
</script>

<template>
  <AModal v-model:open="modalOpen" :title="null" :footer="null" :keyboard="true" mask :closable="false" width="500px"
    centered :styles="stylesFn" @cancel="close">
    <h2 :id="panelTitleId" class="sr-only">
      搜索文章
    </h2>
    <p :id="panelDescId" class="sr-only">
      输入关键词搜索标题或摘要，按 Enter 查看全部结果
    </p>

    <div class="flex items-center gap-3 border-b border-border px-4 py-3.5 sm:px-5">
      <Search class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <AInput ref="inputRef" v-model:value="query" type="search" autocomplete="off" class="post-search-input"
        placeholder="搜索文章标题或摘要…" @press-enter="goToFullResults" />
      <AButton type="text" shape="circle" :aria-label="`关闭搜索（${shortcutLabel} 可再次打开）`" @click="close">
        <template #icon>
          <X class="size-4" aria-hidden="true" />
        </template>
      </AButton>
    </div>

    <div class="max-h-[min(52vh,22rem)] overflow-y-auto overscroll-contain px-2 py-2 sm:px-3">
      <p v-if="!hasQuery" class="px-3 py-8 text-center text-sm text-muted-foreground">
        输入关键词，将实时匹配已发布文章
      </p>

      <div v-else-if="loading && !hasResults"
        class="flex items-center justify-center gap-2 px-3 py-10 text-sm text-muted-foreground" aria-live="polite">
        <ASpin size="small" />
        搜索中…
      </div>

      <div v-else-if="showEmpty" class="px-3 py-8">
        <AEmpty :description="`未找到「${trimmedQuery}」相关文章`" />
      </div>

      <ul v-else-if="hasResults" class="list-none space-y-0.5 p-0">
        <li v-for="post in previewItems" :key="post.id">
          <button type="button"
            class="group flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15"
            @click="openPost(post.slug)">
            <span class="line-clamp-1 font-medium text-foreground group-hover:text-foreground">
              {{ post.title }}
            </span>
            <span v-if="post.summary" class="line-clamp-1 text-xs text-muted-foreground">
              {{ post.summary }}
            </span>
          </button>
        </li>
      </ul>
    </div>

    <footer
      class="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-5">
      <span class="hidden sm:inline">
        <kbd class="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-[10px]">{{
          shortcutLabel
          }}</kbd>
        打开搜索
      </span>
      <span class="sm:hidden">
        按 Enter 查看全部
      </span>

      <AButton type="default" shape="round" size="small" :disabled="!hasQuery" @click="goToFullResults">
        <template v-if="previewTotal > previewItems.length">
          查看全部 {{ previewTotal }} 篇
        </template>
        <template v-else>
          查看全部结果
        </template>
        <ArrowRight class="ml-1 size-3.5" aria-hidden="true" />
      </AButton>
    </footer>
  </AModal>
</template>

<style scoped>
.post-search-input {
  border: none !important;
  background: transparent !important;
}

:deep(.post-search-input .ant-input) {
  padding-left: 0;
  padding-right: 0;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  color: var(--blog-fg) !important;
}

:deep(.post-search-input .ant-input::placeholder) {
  color: var(--blog-muted) !important;
}
</style>
