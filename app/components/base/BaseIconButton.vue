<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    label: string
    type?: 'button' | 'submit' | 'reset'
    class?: string
  }>(),
  {
    type: 'button',
  },
)
</script>

<template>
  <button :type="type" :aria-label="label" :class="cn(
    'inline-flex size-9 items-center justify-center rounded-full',
    'border border-blog-nav-border bg-transparent text-blog-nav-muted',
    'transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-blog-nav-fg',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
    props.class,
  )">
    <slot />
  </button>
</template>
