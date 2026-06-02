<script setup lang="ts">
import { wlLive2d } from 'wl-live2d'
import { defaultLive2dOptions } from '~/config/live2d'

const config = useRuntimeConfig()

let instance: ReturnType<typeof wlLive2d> | null = null

function applyStageLayout(target: ReturnType<typeof wlLive2d>) {
  const wrapper = target.stage?.wrapper
  if (!wrapper) {
    return
  }
  wrapper.classList.add('right')
  wrapper.style.position = 'fixed'
  wrapper.style.left = 'auto'
  wrapper.style.right = '0.75rem'
  wrapper.style.bottom = '5.5rem'
  wrapper.style.zIndex = '30'
  wrapper.style.margin = '0'
  wrapper.style.pointerEvents = 'auto'
}

function mountLive2d() {
  if (!config.public.live2dEnabled) {
    return
  }

  instance = wlLive2d({
    ...defaultLive2dOptions,
    fixed: true,
  })

  setLive2dInstance(instance)
  applyStageLayout(instance)
  instance.tips.stopFade()

  instance.onModelLoaded(() => {
    if (instance) {
      applyStageLayout(instance)
      instance.tips.stopFade()
    }
  })
}

function destroyLive2d() {
  instance?.destroy()
  instance = null
  setLive2dInstance(null)
}

onMounted(() => {
  mountLive2d()
})

onBeforeUnmount(() => {
  destroyLive2d()
})
</script>

<template>
  <span class="sr-only" aria-hidden="true" />
</template>
