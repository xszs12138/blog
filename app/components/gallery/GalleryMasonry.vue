<script setup lang="ts">
import type { GalleryImage } from '~/types/gallery'
import type { MotionVariants } from '@vueuse/motion'

defineProps<{
  images: GalleryImage[]
}>()

function itemMotion(index: number): MotionVariants<string> {
  const stagger = (index % 10) * 55
  return {
    initial: {
      opacity: 0,
      scale: 0.9,
      y: 36,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: stagger,
        duration: 520,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hovered: {
      scale: 1.02,
      transition: { duration: 280 },
    },
  }
}
</script>

<template>
  <div
    class="gallery-masonry gallery-masonry--cols-2 gallery-masonry--cols-3 gallery-masonry--cols-4 gallery-masonry--cols-5"
    role="list"
  >
    <article
      v-for="(image, index) in images"
      :key="image.key"
      v-motion="itemMotion(index)"
      class="gallery-masonry__item"
      role="listitem"
    >
      <a
        :href="image.url"
        target="_blank"
        rel="noopener noreferrer"
        class="gallery-masonry__link"
        :aria-label="image.name || '查看原图'"
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
    </article>
  </div>
</template>
