<script setup lang="ts">
import CanvasNestBackground from '~/components/background/CanvasNestBackground.vue'
import Live2dHost from '~/components/live2d/Live2dHost.vue'
import MusicPlayerDock from '~/components/music/MusicPlayerDock.vue'
import MusicPlayerHost from '~/components/music/MusicPlayerHost.vue'
import PostSearchPanel from '~/components/search/PostSearchPanel.vue'

const config = useRuntimeConfig()
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="var(--blog-hero-accent)" :height="2" />
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <CanvasNestBackground v-if="config.public.canvasNestEnabled" />
    <PostSearchPanel />
    <MusicPlayerHost />
    <MusicPlayerDock />
    <Live2dHost />
  </ClientOnly>
</template>
