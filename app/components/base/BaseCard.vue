<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    :class="cn(
      'rounded-2xl border border-border bg-blog-card p-5 shadow-sm',
      'dark:shadow-black/25',
      props.class,
    )"
  >
    <slot />
  </div>
</template>
