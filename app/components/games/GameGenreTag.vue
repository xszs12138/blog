<script setup lang="ts">
import { cn } from '~/utils/common/cn'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <span :class="cn(
    'inline-flex max-w-full shrink-0 items-center truncate rounded-full border border-(--games-chip-border) bg-(--games-chip-bg) px-2 py-0.5 text-[10px] font-medium leading-none text-(--games-muted)',
    props.class,
  )">
    <slot />
  </span>
</template>
