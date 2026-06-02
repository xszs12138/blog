<script setup lang="ts">
const audioEl = ref<HTMLAudioElement | null>(null)

const {
  bindAudio,
  onLoadedMetadata,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  onError,
} = useGlobalMusicPlayer()

watch(
  audioEl,
  (el) => {
    bindAudio(el)
  },
  { immediate: true },
)
</script>

<template>
  <audio
    ref="audioEl"
    class="sr-only"
    preload="metadata"
    crossorigin="anonymous"
    @loadedmetadata="onLoadedMetadata"
    @timeupdate="onTimeUpdate"
    @play="onPlay"
    @pause="onPause"
    @ended="onEnded"
    @error="onError"
  />
</template>
