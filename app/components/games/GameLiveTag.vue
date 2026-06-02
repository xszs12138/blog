<script setup lang="ts">
import { cn } from '~/utils/common/cn'

const props = withDefaults(
  defineProps<{
    /** 是否开播中 */
    isLive?: boolean
    /** 覆盖默认文案 */
    label?: string
    class?: string
  }>(),
  {
    isLive: true,
  },
)

const displayLabel = computed(() => {
  if (props.label?.trim()) {
    return props.label.trim()
  }
  return props.isLive ? 'LIVE' : '未开播'
})
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
      isLive
        ? 'bg-green-500/10 text-green-500 dark:bg-green-500/15'
        : 'bg-muted/50 font-medium text-muted-foreground',
      props.class,
    )"
  >
    <span
      :class="cn(
        'size-1.5 rounded-full',
        isLive
          ? 'animate-pulse bg-green-500'
          : 'bg-muted-foreground/50',
      )"
      aria-hidden="true"
    />
    {{ displayLabel }}
  </span>
</template>
