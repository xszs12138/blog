<script setup lang="ts">
defineProps<{
  cover: string
  title: string
}>()
</script>

<template>
  <section class="post-detail__hero relative isolate w-full overflow-hidden" aria-hidden="true">
    <img :src="cover" :alt="`${title} 封面`" class="absolute inset-0 size-full object-cover" fetchpriority="high"
      decoding="async">
    <div class="post-detail__hero-fade absolute inset-0" />
    <div class="post-detail__hero-top-fade absolute inset-x-0 top-0 h-28" />
    <div id="post-hero-waves" class="waves absolute -bottom-px h-[10vh] max-h-37.5 min-h-12.5 w-full md:h-[15vh]"
      style="transform: translateZ(0)">
      <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="geometricPrecision" aria-hidden="true">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v48h-352z" />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" />
          <use xlink:href="#gentle-wave" x="48" y="3" />
          <use xlink:href="#gentle-wave" x="48" y="5" />
          <use xlink:href="#gentle-wave" x="48" y="7" />
        </g>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.post-detail__hero {
  height: min(42vh, 22rem);
}

@media (min-width: 768px) {
  .post-detail__hero {
    height: min(46vh, 26rem);
  }
}
</style>
