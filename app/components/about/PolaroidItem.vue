<script setup lang="ts">
defineProps<{
  image: {
    src: string
    alt: string
  }
  index: number
}>()
</script>

<template>
  <figure
    class="polaroid group mx-auto flex w-full max-w-48 flex-col border border-black/10 bg-[#fafaf8] p-2.5 pb-0 shadow-[0_4px_20px_rgb(0_0_0/0.1)] ring-1 ring-black/5 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_10px_28px_rgb(0_0_0/0.14)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/12 dark:bg-[#f4f4f2] dark:shadow-[0_8px_32px_rgb(0_0_0/0.45)] dark:ring-white/10 dark:hover:shadow-[0_12px_40px_rgb(0_0_0/0.55)] md:max-w-52"
    :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
  >
    <div class="overflow-hidden rounded-sm bg-[#ececea] dark:bg-[#e8e8e6]">
      <img
        :src="image.src"
        :alt="image.alt"
        class="aspect-square w-full object-cover"
        loading="lazy"
        decoding="async"
      >
    </div>
    <figcaption
      class="flex min-h-11 w-full items-center justify-center border-t border-black/6 px-2 py-3 text-center text-sm font-semibold tracking-wide text-[#1a2e22] dark:border-black/8 dark:text-[#0f1a14]"
    >
      {{ image.alt }}
    </figcaption>
  </figure>
</template>
