<script lang="ts" setup>
import type { GalleryImage } from '~/types/gallery'

definePageMeta({
  layout: 'default',
})

const PAGE_SIZE = 24

const { getImages } = useGalleryApi()

const page = ref(1)
const items = ref<GalleryImage[]>([])
const total = ref(0)
const loading = ref(false)
const initialPending = ref(true)

const sentinel = ref<HTMLElement | null>(null)

async function fetchPage(targetPage: number, append: boolean) {
  loading.value = true
  try {
    const result = await getImages({
      page: targetPage,
      pageSize: PAGE_SIZE,
      order: 'newest',
    })
    total.value = result.total
    if (append) {
      const existing = new Set(items.value.map(item => item.key))
      const merged = result.items.filter(item => !existing.has(item.key))
      items.value = [...items.value, ...merged]
    }
    else {
      items.value = result.items
    }
    page.value = targetPage
  }
  catch {
    if (!append) {
      items.value = []
      total.value = 0
    }
  }
  finally {
    loading.value = false
    initialPending.value = false
  }
}

await fetchPage(1, false)

const hasMore = computed(() => items.value.length < total.value)

async function loadMore() {
  if (loading.value || !hasMore.value) {
    return
  }
  await fetchPage(page.value + 1, true)
}

if (import.meta.client) {
  useIntersectionObserver(
    sentinel,
    ([entry]) => {
      if (entry?.isIntersecting) {
        loadMore()
      }
    },
    { rootMargin: '320px' },
  )
}

useHead({
  title: '相册 | xsZs Blog',
})
</script>

<template>
  <div class="gallery-page">
    <div
      v-if="initialPending"
      class="gallery-masonry gallery-masonry--cols-2 gallery-masonry--cols-3 gallery-masonry--cols-4 gallery-masonry--cols-5"
      aria-busy="true"
    >
      <div
        v-for="i in 12"
        :key="i"
        class="gallery-masonry__item mb-2 h-36 animate-pulse break-inside-avoid rounded-md bg-muted/15 sm:h-44"
      />
    </div>

    <template v-else-if="items.length">
      <GalleryMasonry :images="items" />
      <div ref="sentinel" class="gallery-page__sentinel" aria-hidden="true" />
      <div v-if="loading && hasMore" class="gallery-page__loader" aria-hidden="true">
        <span class="gallery-page__loader-dot" />
      </div>
    </template>

    <div
      v-else
      class="flex min-h-[70svh] items-center justify-center"
      role="status"
      aria-label="暂无图片"
    />
  </div>
</template>
