<script setup lang="ts">
import type { MusicTrack } from '~/types/music'
import {
  ChevronDown,
  ChevronUp,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from '@lucide/vue'
import { demoMusicPlaylist } from '~/config/music-demo'

// TODO: 接口就绪后改为 useFetch('/api/web/music') 等
const tracks = ref<MusicTrack[]>(demoMusicPlaylist)

const lyricsContainerRef = ref<HTMLElement | null>(null)
const isUserScrollingLyrics = ref(false)
let lyricsScrollTimer: ReturnType<typeof setTimeout> | undefined

const {
  audioRef,
  currentIndex,
  currentTrack,
  isPlaying,
  progress,
  currentTimeText,
  durationText,
  playModeIndex,
  volume,
  isMuted,
  lyrics,
  lyricsStatus,
  currentLrcIndex,
  errorMessage,
  togglePlay,
  playNext,
  playPrev,
  cyclePlayMode,
  setVolume,
  toggleMute,
  seekByPercent,
  seekToTime,
  playTrackByIndex,
  onLoadedMetadata,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  onError,
} = useMusicPlayer({ tracks, initialVolume: 0.7, initialPlayMode: 'list' })

const showPlaylist = ref(false)
const showLyricsDrawer = ref(true)

const displayTitle = computed(() => {
  if (errorMessage.value) {
    return errorMessage.value
  }
  return currentTrack.value?.name ?? '暂未播放'
})

const displayArtist = computed(() => {
  return currentTrack.value?.artist ?? '暂无歌曲'
})

const volumePercent = computed(() => (isMuted.value ? 0 : volume.value * 100))

function onProgressClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  seekByPercent(percent)
}

function onVolumeClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  setVolume(percent)
}

function resetLyricsScrollTimer() {
  if (lyricsScrollTimer) {
    clearTimeout(lyricsScrollTimer)
  }
  lyricsScrollTimer = setTimeout(() => {
    isUserScrollingLyrics.value = false
    scrollActiveLyricIntoView('auto')
  }, 3000)
}

function scrollActiveLyricIntoView(behavior: ScrollBehavior = 'smooth') {
  if (isUserScrollingLyrics.value || currentLrcIndex.value < 0) {
    return
  }
  const container = lyricsContainerRef.value
  if (!container) {
    return
  }
  const line = container.querySelector<HTMLElement>(
    `[data-lrc-index="${currentLrcIndex.value}"]`,
  )
  if (!line) {
    return
  }
  // Use DOM rect delta instead of offsetTop to avoid drift with margins/line-height changes.
  const containerRect = container.getBoundingClientRect()
  const lineRect = line.getBoundingClientRect()
  const containerCenterY = containerRect.top + containerRect.height / 2
  const lineCenterY = lineRect.top + lineRect.height / 2
  const delta = lineCenterY - containerCenterY
  const nextTop = container.scrollTop + delta
  container.scrollTo({ top: nextTop, behavior })
}

function onLyricsUserScroll() {
  isUserScrollingLyrics.value = true
  resetLyricsScrollTimer()
}

watch(currentLrcIndex, () => {
  scrollActiveLyricIntoView()
})

watch(lyrics, async () => {
  await nextTick()
  scrollActiveLyricIntoView('auto')
})

onBeforeUnmount(() => {
  if (lyricsScrollTimer) {
    clearTimeout(lyricsScrollTimer)
  }
})

function openLtrDrawer() {
  showLyricsDrawer.value = !showLyricsDrawer.value
}
</script>

<template>
  <BaseCard title="音乐">
    <template #headerRight>
      <button type="button" class="rounded-full aspect-square px-2 py-0.5 ring-1 ring-border  mb-2"
        :aria-expanded="showLyricsDrawer" aria-controls="music-lyrics-drawer" @click="openLtrDrawer">
        <ChevronDown v-if="showLyricsDrawer" class="size-4" />
        <ChevronUp v-else class="size-4" />
      </button>
    </template>
    <article class="music-player">
      <div class="flex items-center gap-3">
        <div class="relative size-14 shrink-0">
          <div
            class="flex size-full items-center justify-center overflow-hidden rounded-full bg-accent/10 ring-1 ring-border">
            <img v-if="currentTrack?.cover" :src="currentTrack.cover" :alt="`${displayTitle} 封面`"
              class="size-full object-cover" :class="{ 'animate-spin-slow': isPlaying }">
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-foreground" :title="displayTitle">
            {{ displayTitle }}
          </p>
          <p class="truncate text-xs text-muted-foreground" :title="displayArtist">
            {{ displayArtist }}
          </p>
          <div class="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground/90">
            <span class="tabular-nums">{{ currentTimeText }} / {{ durationText }}</span>
            <button type="button" class="inline-flex items-center gap-1 rounded-md p-0.5 hover:text-accent"
              :aria-label="isMuted ? '取消静音' : '静音'" @click="toggleMute">
              <VolumeX v-if="isMuted || volume === 0" class="size-3.5" />
              <Volume2 v-else class="size-3.5" />
            </button>
            <div class="h-1 w-14 cursor-pointer overflow-hidden rounded-full bg-white/10" role="slider" aria-label="音量"
              :aria-valuenow="Math.round(volumePercent)" aria-valuemin="0" aria-valuemax="100" @click="onVolumeClick">
              <div class="h-full rounded-full bg-accent transition-[width]" :style="{ width: `${volumePercent}%` }" />
            </div>
          </div>
        </div>
      </div>

      <div class="progress-container mt-4 h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
        role="slider" aria-label="播放进度" :aria-valuenow="Math.round(progress)" aria-valuemin="0" aria-valuemax="100"
        @click="onProgressClick">
        <div class="h-full rounded-full bg-accent transition-[width] duration-100" :style="{ width: `${progress}%` }" />
      </div>

      <div class="mt-4 flex items-center justify-center gap-3 text-muted-foreground">
        <button type="button" class="control-btn" :class="{ 'text-accent': playModeIndex !== 0 }" aria-label="切换播放模式"
          @click="cyclePlayMode">
          <Shuffle v-if="playModeIndex === 2" class="size-4" />
          <Repeat1 v-else-if="playModeIndex === 1" class="size-4" />
          <Repeat v-else class="size-4" />
        </button>
        <button type="button" class="control-btn" aria-label="上一首" @click="playPrev">
          <SkipBack class="size-4" />
        </button>
        <button type="button" class="control-btn control-btn--primary" :class="{ 'control-btn--playing': isPlaying }"
          :aria-label="isPlaying ? '暂停' : '播放'" @click="togglePlay">
          <Pause v-if="isPlaying" class="size-5" />
          <Play v-else class="ml-0.5 size-5" />
        </button>
        <button type="button" class="control-btn" aria-label="下一首" @click="playNext()">
          <SkipForward class="size-4" />
        </button>
        <button type="button" class="control-btn" :class="{ 'text-accent': showPlaylist }" aria-label="播放列表"
          @click="showPlaylist = !showPlaylist">
          <ListMusic class="size-4" />
        </button>
      </div>

      <div v-if="showPlaylist" class="playlist mt-3 max-h-36 overflow-y-auto rounded-lg border border-border/60 p-1"
        role="listbox" aria-label="播放列表">
        <button v-for="(track, idx) in tracks" :key="track.id" type="button" class="playlist-item"
          :class="{ 'playlist-item--active': idx === currentIndex }" role="option"
          :aria-current="idx === currentIndex ? 'true' : undefined" @click="playTrackByIndex(idx)">
          <span class="truncate font-medium">{{ track.name }}</span>
          <span class="truncate text-[10px] text-muted-foreground">{{ track.artist }}</span>
        </button>
      </div>

      <Transition name="lyrics-drawer">
        <div v-show="showLyricsDrawer" id="music-lyrics-drawer" ref="lyricsContainerRef" class="lyrics mt-4"
          aria-label="歌词" @wheel="onLyricsUserScroll" @touchstart.passive="onLyricsUserScroll">
          <p v-if="lyricsStatus === 'loading'" class="lyrics-placeholder">
            正在加载歌词...
          </p>
          <p v-else-if="lyricsStatus === 'failed'" class="lyrics-placeholder">
            歌词加载失败
          </p>
          <p v-else-if="!lyrics.length" class="lyrics-placeholder">
            暂无歌词
          </p>
          <p v-for="(line, idx) in lyrics" v-else :key="`${currentTrack?.id ?? 'track'}-${idx}`" class="lyrics-line"
            :class="{ 'lyrics-line--active': idx === currentLrcIndex }" :data-lrc-index="idx"
            @click="seekToTime(line.time)">
            {{ line.text }}
          </p>
        </div>
      </Transition>

      <audio ref="audioRef" preload="metadata" crossorigin="anonymous" @loadedmetadata="onLoadedMetadata"
        @timeupdate="onTimeUpdate" @play="onPlay" @pause="onPause" @ended="onEnded" @error="onError" />
    </article>
  </BaseCard>
</template>

<style scoped>
.music-player {
  padding: 0.125rem 0;
}

.control-btn {
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 12%);
  background: rgb(255 255 255 / 2%);
  color: inherit;
  transition: all 0.2s ease;
}

.control-btn:hover {
  border-color: rgb(112 250 123 / 42%);
  color: rgb(166 255 177);
}

.control-btn:focus-visible {
  outline: 2px solid rgb(112 250 123 / 72%);
  outline-offset: 2px;
}

.control-btn--primary {
  height: 2.6rem;
  width: 2.6rem;
  border-color: rgb(112 250 123 / 52%);
  background: rgb(112 250 123 / 22%);
  color: rgb(176 255 186);
}

.control-btn--playing {
  background: rgb(112 250 123 / 88%);
  color: rgb(12 18 14);
}

.playlist-item {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.125rem;
  border-radius: 0.5rem;
  padding: 0.5rem 0.625rem;
  text-align: left;
  font-size: 0.75rem;
  transition: background-color 0.15s ease;
}

.playlist-item:hover {
  background: rgb(255 255 255 / 5%);
}

.playlist-item--active {
  background: rgb(112 250 123 / 12%);
  color: rgb(166 255 177);
}

.lyrics {
  height: 11rem;
  overflow-y: auto;
  padding: 0 0.25rem;
  text-align: center;
  scroll-behavior: smooth;
}

.lyrics-placeholder {
  margin: 0;
  padding: 1.5rem 0;
  font-size: 0.8rem;
  color: rgb(221 225 232 / 60%);
}

.lyrics-line {
  margin: 0 0 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1.4;
  color: rgb(221 225 232 / 68%);
  transition: color 0.2s ease, font-size 0.2s ease;
}

.lyrics-line--active {
  color: rgb(142 255 153);
  font-size: 0.9rem;
  font-weight: 700;
}

.lyrics::-webkit-scrollbar {
  width: 3px;
}

.lyrics::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(255 255 255 / 24%);
}

.lyrics-drawer-enter-active,
.lyrics-drawer-leave-active {
  transition:
    max-height 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease,
    margin-top 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
}

.lyrics-drawer-enter-from,
.lyrics-drawer-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0 !important;
}

.lyrics-drawer-enter-to,
.lyrics-drawer-leave-from {
  max-height: 11rem;
  opacity: 1;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 12s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-spin-slow {
    animation: none;
  }

  .lyrics {
    scroll-behavior: auto;
  }
}
</style>
