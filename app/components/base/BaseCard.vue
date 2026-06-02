<script setup lang="ts">
import { cn } from '~/utils/common/cn'

const props = defineProps<{
  class?: string
  title?: string
}>()
</script>

<template>
  <div :class="cn(
    'blog-card rounded-2xl border border-border bg-blog-card p-5',
    props.class,
  )">
    <div class="flex min-w-0 items-center justify-between gap-2">
      <div
        v-if="title"
        class="mb-4 flex min-w-0 items-center gap-2 font-heading text-base font-semibold tracking-tight text-foreground"
      >
        <span class="h-4 w-[3px] shrink-0 rounded-full bg-accent" aria-hidden="true" />
        {{ title }}
      </div>
      <slot name="headerRight" />
    </div>
    <slot />
  </div>
</template>
