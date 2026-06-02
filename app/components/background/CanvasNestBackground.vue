<script setup lang="ts">
import { canvasNestDark, canvasNestLight } from '~/config/canvas-nest'
import { startCanvasNest } from '~/utils/background/canvas-nest'

const { isDark } = useAppTheme()

let destroy: (() => void) | null = null

function mount() {
  destroy?.()
  destroy = startCanvasNest(isDark.value ? canvasNestDark : canvasNestLight)
}

onMounted(() => {
  mount()
  watch(isDark, mount)
})

onBeforeUnmount(() => {
  destroy?.()
  destroy = null
})
</script>

<template>
  <span class="sr-only" aria-hidden="true">装饰性粒子背景</span>
</template>
