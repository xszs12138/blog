<script setup lang="ts">
import type { HeadList } from 'md-editor-v3'
import type { TocItem } from '~/types/toc'
import { MdPreview } from 'md-editor-v3'

import {
  POST_MD_CODE_THEME,
  POST_MD_PREVIEW_ID,
  POST_MD_PREVIEW_THEME,
} from '~/config/md-editor'
import { slugifyHeading } from '~/utils/post/slugify-heading'

import 'md-editor-v3/lib/preview.css'

const props = defineProps<{
  content: string
}>()

const emit = defineEmits<{
  catalogReady: [TocItem[]]
}>()

const isDark = useThemeDark()

const articleRef = ref<HTMLElement | null>(null)
const editorTheme = computed(() => (isDark.value ? 'dark' : 'light'))

const usedHeadingIds = new Set<string>()

function resetHeadingIds() {
  usedHeadingIds.clear()
}

function mdHeadingId({ text, index }: { text: string, index: number }) {
  return slugifyHeading(text, index, usedHeadingIds)
}

function mapCatalogToToc(list: HeadList[]): TocItem[] {
  resetHeadingIds()
  const toc: TocItem[] = []

  list.forEach((item, idx) => {
    const id = mdHeadingId({ text: item.text, index: idx + 1 })
    if (item.level !== 2 && item.level !== 3) {
      return
    }

    const text = item.text.replace(/\s+/g, ' ').trim()
    if (!text) {
      return
    }

    toc.push({ id, text, level: item.level })
  })

  return toc
}

function emitCatalog(items: TocItem[]) {
  // 目录依赖 MdPreview DOM，仅在客户端更新，避免 SSR/CSR 侧栏子节点不一致
  if (!import.meta.client) {
    return
  }
  emit('catalogReady', items)
}

function onGetCatalog(list: HeadList[]) {
  emitCatalog(mapCatalogToToc(list))
}

function collectCatalogFromRoot(root: HTMLElement | null) {
  if (!root) {
    return
  }

  const previewRoot = root.querySelector(`#${POST_MD_PREVIEW_ID}-preview`)
  const searchRoot = previewRoot ?? root
  const headings = searchRoot.querySelectorAll<HTMLElement>('h2[id], h3[id]')

  const toc: TocItem[] = []
  headings.forEach((el) => {
    const level = el.tagName.toLowerCase() === 'h2' ? 2 : 3
    const text = el.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    if (!text) {
      return
    }
    toc.push({ id: el.id, text, level })
  })

  if (toc.length === 0) {
    return
  }
  emitCatalog(toc)
}

function onHtmlChanged() {
  nextTick(() => {
    collectCatalogFromRoot(articleRef.value)
  })
}

function onPreviewRemount() {
  nextTick(() => {
    collectCatalogFromRoot(articleRef.value)
  })
}

watch(() => props.content, () => {
  resetHeadingIds()
}, { immediate: true })

defineExpose({
  articleRef,
})
</script>

<template>
  <div ref="articleRef" class="post-article-preview">
    <MdPreview
      :id="POST_MD_PREVIEW_ID"
      :model-value="content"
      language="zh-CN"
      :theme="editorTheme"
      :preview-theme="POST_MD_PREVIEW_THEME"
      :code-theme="POST_MD_CODE_THEME"
      :md-heading-id="mdHeadingId"
      :show-code-row-number="true"
      :on-html-changed="onHtmlChanged"
      :on-get-catalog="onGetCatalog"
      :on-remount="onPreviewRemount"
    />
  </div>
</template>
