<script setup lang="ts">
import { cn } from '~/utils/common/cn'

const props = defineProps<{
  class?: string
  title?: string
}>()
</script>

<template>
  <div :class="cn(
    'rounded-2xl border border-border bg-blog-card p-5 shadow-sm',
    'dark:shadow-black/25',
    props.class,
  )">
    <div class="flex justify-between items-center">
      <div v-if="title"
        class="gap-5 mb-4 flex items-center font-heading text-base font-semibold tracking-tight text-foreground">
        <span class="h-4 w-[3px] shrink-0 rounded-full bg-accent" aria-hidden="true" />
        {{ title }}
      </div>
      <slot name="headerRight" />
    </div>
    <slot />
  </div>
</template>
