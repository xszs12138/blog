<script setup lang="ts">
import type { GalleryImage } from '~/types/gallery'

const props = defineProps<{
  images?: GalleryImage[]
  loading?: boolean
}>()

const masonryColumns = { xs: 2, sm: 3, lg: 4, xxl: 5 } as const
const masonryGutter = { xs: 6, sm: 8 } as const

const masonryItems = computed(() => {
  if (props.loading) {
    return Array.from({ length: 12 }, (_, index) => ({
      key: `gallery-skeleton-${index}`,
      data: null as GalleryImage | null,
    }))
  }

  return (props.images ?? []).map(image => ({
    key: image.key,
    data: image,
  }))
})
</script>

<template>
  <AMasonry
    fresh
    class="gallery-masonry"
    :columns="masonryColumns"
    :gutter="masonryGutter"
    :items="masonryItems"
    :aria-busy="loading ? 'true' : undefined"
    role="list"
  >
    <template #itemRender="{ data: image }">
      <div v-if="loading || !image" class="gallery-masonry__skeleton" aria-hidden="true" />
      <a
        v-else
        :href="image.url"
        target="_blank"
        rel="noopener noreferrer"
        class="gallery-masonry__link"
        :aria-label="image.name || '查看原图'"
        role="listitem"
      >
        <img
          :src="image.thumbnailUrl || image.url"
          alt=""
          class="gallery-masonry__img"
          loading="lazy"
          decoding="async"
          :width="image.width || undefined"
          :height="image.height || undefined"
        >
      </a>
    </template>
  </AMasonry>
</template>
