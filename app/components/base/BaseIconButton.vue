<script setup lang="ts">
import { cn } from '~/utils/common/cn'

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
  <AButton
    type="text"
    shape="circle"
    :html-type="type"
    :aria-label="label"
    :class="cn('blog-nav-icon-btn', props.class)"
  >
    <slot />
  </AButton>
</template>
