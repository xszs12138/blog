<script setup lang="ts">
const props = defineProps<{
  cover?: string
  title: string
}>()

const hasCover = computed(() => Boolean(props.cover?.trim()))
</script>

<template>
  <section
    class="post-detail__hero relative isolate w-full overflow-hidden"
    :class="hasCover ? 'post-detail__hero--cover' : 'post-detail__hero--plain'"
  >
    <img
      v-if="hasCover"
      :src="cover"
      :alt="`${title} 封面`"
      class="absolute inset-0 size-full object-cover"
      fetchpriority="high"
      decoding="async"
    >
    <div v-else class="post-detail__hero-bg absolute inset-0" aria-hidden="true" />

    <div class="post-detail__hero-fade absolute inset-0" />
    <div class="post-detail__hero-top-fade absolute inset-x-0 top-0 h-28" />

    <div
      id="post-hero-waves"
      class="waves absolute -bottom-px h-[10vh] max-h-37.5 min-h-12.5 w-full md:h-[15vh]"
      style="transform: translateZ(0)"
    >
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="geometricPrecision"
        aria-hidden="true"
      >
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
.post-detail__hero--cover {
  height: min(42vh, 22rem);
}

.post-detail__hero--plain {
  height: min(22vh, 11rem);
}

@media (min-width: 768px) {
  .post-detail__hero--cover {
    height: min(46vh, 26rem);
  }

  .post-detail__hero--plain {
    height: min(24vh, 12rem);
  }
}

.post-detail__hero-bg {
  background:
    radial-gradient(
      ellipse 80% 120% at 20% 0%,
      color-mix(in srgb, var(--blog-accent) 28%, transparent),
      transparent 62%
    ),
    radial-gradient(
      ellipse 70% 90% at 100% 100%,
      color-mix(in srgb, var(--blog-hero-accent) 18%, transparent),
      transparent 55%
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--blog-surface-muted) 85%, var(--blog-bg)),
      var(--blog-bg)
    );
}

.post-detail__hero-fade {
  background: linear-gradient(
    to bottom,
    transparent 35%,
    color-mix(in srgb, var(--blog-bg) 55%, transparent) 72%,
    var(--blog-bg) 100%
  );
}

.post-detail__hero--plain .post-detail__hero-fade {
  background: linear-gradient(
    to bottom,
    transparent 10%,
    color-mix(in srgb, var(--blog-bg) 70%, transparent) 65%,
    var(--blog-bg) 100%
  );
}

.post-detail__hero-top-fade {
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--blog-bg) 92%, transparent),
    transparent
  );
}
</style>
