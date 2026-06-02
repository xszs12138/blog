<script setup lang="ts">
import { cn } from '~/utils/common/cn'

const props = defineProps<{
  class?: string
  innerClass?: string
}>()
</script>

<template>
  <BaseBorderBeam trigger="hover" :duration="6" :beam-size="120" border-radius="1rem" :border-width="1.5"
    :class="props.class">
    <div
      class="games-glow-inner relative z-1 overflow-hidden rounded-2xl border border-border/50 bg-blog-card shadow-sm transition-[border-color] duration-300 dark:shadow-black/20"
      :class="cn(props.innerClass)">
      <slot />
    </div>
  </BaseBorderBeam>
</template>

<style scoped>
.border-beam-host--hover:hover .games-glow-inner,
.border-beam-host--hover:focus-within .games-glow-inner {
  border-color: transparent;
}
</style>
