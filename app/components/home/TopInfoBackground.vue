<script setup lang="ts">
import type { SiteInfo } from '~/types/site'

const { getSite } = useSiteApi()
const { isDark } = useAppTheme()
const { data: site } = await useAsyncData<SiteInfo | null>('web-site', async () => {
  try {
    return await getSite()
  }
  catch {
    return null
  }
})

const frameRef = ref<HTMLElement | null>(null)
const { y: scrollY } = useWindowScroll()
const { height: frameHeight } = useElementSize(frameRef)

/** 0 → 1：随页面向下滚动，遮罩由透明渐变为灰 */
const overlayProgress = computed(() => {
  const range = frameHeight.value || (import.meta.client ? window.innerHeight : 800)
  if (range <= 0) {
    return 0
  }
  return Math.min(1, Math.max(0, scrollY.value / range))
})

const overlayStyle = computed(() => {
  const t = overlayProgress.value
  if (isDark.value) {
    return { backgroundColor: `rgb(10 12 16 / ${(t * 0.82).toFixed(3)})` }
  }
  return { backgroundColor: `rgb(15 20 25 / ${(t * 0.58).toFixed(3)})` }
})

const backgroundImage = computed(() => {
  return isDark.value ? `url(https://bu.dusays.com/2026/05/26/6a14f4cbc6d0e.png)` : `url(https://bu.dusays.com/2026/05/26/6a14f4c05c077.png)`
})

const siteName = computed(() => {
  const name = site.value?.name?.trim()
  if (!name || name === 'xszs-blog') {
    return 'xsZs'
  }
  return name
})
</script>

<template>
  <section class="top-info" aria-label="个人介绍">
    <div ref="frameRef" class="top-info__frame">
      <div class="top-info-background" aria-hidden="true" :style="{ backgroundImage }" />
      <div class="top-info__overlay" aria-hidden="true" :style="overlayStyle" />
      <HomeTopInfoHero :site-name="siteName" :social-links="site?.socialLinks ?? []" />
    </div>
  </section>
</template>

<style scoped>
.top-info {
  position: relative;
  width: 100%;
}

.top-info__frame {
  position: relative;
  width: 100%;
  min-height: 100svh;
  isolation: isolate;
}

.top-info-background {
  position: absolute;
  inset: 0;
  z-index: 0;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.top-info__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  will-change: background-color;
}
</style>
