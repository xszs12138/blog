<script setup lang="ts">
import {
  ChevronDown,
  Music,
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

const STORAGE_KEY = 'music-dock-expanded'

const {
  currentTrack,
  isPlaying,
  progress,
  currentTimeText,
  durationText,
  playModeIndex,
  volume,
  isMuted,
  errorMessage,
  togglePlay,
  playNext,
  playPrev,
  cyclePlayMode,
  toggleMute,
  seekByPercent,
} = useGlobalMusicPlayer()

const expanded = ref(true)

if (import.meta.client) {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === '0') {
    expanded.value = false
  }
}

watch(expanded, (value) => {
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  }
})

const title = computed(() => errorMessage.value || currentTrack.value?.name || '暂无歌曲')
const artist = computed(() => currentTrack.value?.artist ?? '')
const coverUrl = computed(() => currentTrack.value?.cover?.trim() || '')

function onProgressClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  seekByPercent((event.clientX - rect.left) / rect.width)
}

function toggleExpanded() {
  expanded.value = !expanded.value
}

function onCoverClick() {
  void togglePlay()
}
</script>

<template>
  <div
    v-if="currentTrack"
    class="music-dock pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4 sm:bottom-5"
    role="region"
    :aria-label="expanded ? '音乐播放控制' : '音乐播放（已收起）'"
  >
    <div
      class="music-dock__panel pointer-events-auto mx-auto min-w-0 max-w-lg rounded-2xl border border-border/80 bg-card/95 shadow-lg shadow-black/15 backdrop-blur-md dark:shadow-black/30"
    >
      <div class="flex min-w-0 items-center gap-2.5 px-2.5 py-2 sm:gap-3 sm:px-3">
        <button
          type="button"
          class="music-dock__cover shrink-0"
          :class="{ 'music-dock__cover--playing': isPlaying }"
          :aria-label="isPlaying ? '暂停' : '播放'"
          @click="onCoverClick"
        >
          <img
            v-if="coverUrl"
            :src="coverUrl"
            :alt="`${title} 封面`"
            class="size-full object-cover"
            loading="lazy"
          >
          <Music v-else class="size-5 text-muted-foreground" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="min-w-0 flex-1 text-left"
          :title="title"
          @click="!expanded && toggleExpanded()"
        >
          <p class="truncate text-sm font-medium text-foreground">
            {{ title }}
          </p>
          <p v-if="artist" class="truncate text-xs text-muted-foreground">
            {{ artist }}
          </p>
        </button>

        <span
          class="shrink-0 text-[11px] tabular-nums text-muted-foreground transition-opacity duration-200"
          :class="expanded ? 'opacity-100' : 'max-sm:opacity-0 sm:opacity-100'"
        >
          <template v-if="expanded">
            {{ currentTimeText }} / {{ durationText }}
          </template>
          <template v-else>
            {{ currentTimeText }}
          </template>
        </span>

        <button
          type="button"
          class="music-dock__btn music-dock__btn--ghost shrink-0"
          :aria-label="expanded ? '收起播放器' : '展开播放器'"
          :aria-expanded="expanded"
          @click="toggleExpanded"
        >
          <ChevronDown
            class="size-4 transition-transform duration-300 ease-out"
            :class="expanded ? 'rotate-0' : '-rotate-180'"
          />
        </button>
      </div>

      <div
        class="music-dock__body grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :class="expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] pointer-events-none'"
        :aria-hidden="!expanded"
      >
        <div class="min-h-0 overflow-hidden">
          <div
            class="flex flex-col gap-2.5 border-t border-border/60 px-2.5 pb-2.5 pt-2 sm:px-3"
            :class="expanded ? 'opacity-100' : 'opacity-0'"
            :style="{ transition: 'opacity 0.2s ease' }"
          >
            <div
              class="music-dock__progress h-1.5 w-full cursor-pointer overflow-hidden rounded-full"
              role="slider"
              aria-label="播放进度"
              :aria-valuenow="Math.round(progress)"
              aria-valuemin="0"
              aria-valuemax="100"
              tabindex="-1"
              @click="onProgressClick"
            >
              <div
                class="h-full rounded-full bg-accent transition-[width] duration-100"
                :style="{ width: `${progress}%` }"
              />
            </div>

            <div class="flex items-center justify-between gap-2 text-muted-foreground">
              <button
                type="button"
                class="music-dock__btn music-dock__btn--ghost"
                :class="{ 'music-dock__btn--active': playModeIndex !== 0 }"
                aria-label="切换播放模式"
                :tabindex="expanded ? 0 : -1"
                @click="cyclePlayMode"
              >
                <Shuffle v-if="playModeIndex === 2" class="size-4" />
                <Repeat1 v-else-if="playModeIndex === 1" class="size-4" />
                <Repeat v-else class="size-4" />
              </button>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="music-dock__btn music-dock__btn--ghost"
                  aria-label="上一首"
                  :tabindex="expanded ? 0 : -1"
                  @click="playPrev"
                >
                  <SkipBack class="size-4" />
                </button>
                <button
                  type="button"
                  class="music-dock__btn music-dock__btn--primary"
                  :aria-label="isPlaying ? '暂停' : '播放'"
                  :tabindex="expanded ? 0 : -1"
                  @click="togglePlay"
                >
                  <Pause v-if="isPlaying" class="size-5" stroke-width="2.25" />
                  <Play v-else class="ml-0.5 size-5" stroke-width="2.25" />
                </button>
                <button
                  type="button"
                  class="music-dock__btn music-dock__btn--ghost"
                  aria-label="下一首"
                  :tabindex="expanded ? 0 : -1"
                  @click="playNext()"
                >
                  <SkipForward class="size-4" />
                </button>
              </div>

              <button
                type="button"
                class="music-dock__btn music-dock__btn--ghost"
                :aria-label="isMuted ? '取消静音' : '静音'"
                :tabindex="expanded ? 0 : -1"
                @click="toggleMute"
              >
                <VolumeX v-if="isMuted || volume === 0" class="size-4" />
                <Volume2 v-else class="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.music-dock__cover {
  display: flex;
  height: 2.75rem;
  width: 2.75rem;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid var(--music-dock-btn-border);
  background: var(--music-dock-btn-bg);
  transition: border-color 0.2s ease;
}

.music-dock__cover:hover {
  border-color: var(--music-dock-btn-border-hover);
}

.music-dock__cover:focus-visible {
  outline: 2px solid var(--blog-accent, #22a06b);
  outline-offset: 2px;
}

.music-dock__cover--playing img {
  animation: music-dock-cover-spin 14s linear infinite;
}

@keyframes music-dock-cover-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.music-dock__btn {
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid var(--music-dock-btn-border);
  background: var(--music-dock-btn-bg);
  color: var(--music-dock-btn-fg);
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.15s ease;
}

.music-dock__btn:hover {
  border-color: var(--music-dock-btn-border-hover);
  color: var(--music-dock-btn-fg-hover);
  background: var(--music-dock-btn-bg-hover);
}

.music-dock__btn:focus-visible {
  outline: 2px solid var(--blog-accent, #22a06b);
  outline-offset: 2px;
}

.music-dock__btn--ghost {
  border-color: transparent;
  background: transparent;
}

.music-dock__btn--ghost:hover {
  background: var(--music-dock-btn-bg-hover);
}

.music-dock__btn--active {
  color: var(--blog-accent, #22a06b);
}

.music-dock__btn--primary {
  height: 2.5rem;
  width: 2.5rem;
  border: none;
  background: var(--blog-accent, #22a06b);
  color: var(--blog-accent-fg, #fff);
  box-shadow: 0 2px 8px rgb(34 160 107 / 35%);
}

.music-dock__btn--primary:hover {
  filter: brightness(1.06);
  color: var(--blog-accent-fg, #fff);
  border: none;
}

.music-dock__btn--primary:active {
  transform: scale(0.96);
}

.dark .music-dock__btn--primary {
  box-shadow: 0 2px 12px rgb(94 233 181 / 25%);
}

.music-dock__progress {
  background: var(--music-dock-progress-bg);
}

.music-dock {
  --music-dock-btn-border: rgb(15 20 25 / 14%);
  --music-dock-btn-bg: rgb(15 20 25 / 5%);
  --music-dock-btn-fg: rgb(15 20 25 / 72%);
  --music-dock-btn-border-hover: rgb(34 160 107 / 45%);
  --music-dock-btn-fg-hover: rgb(15 20 25 / 88%);
  --music-dock-btn-bg-hover: rgb(34 160 107 / 10%);
  --music-dock-progress-bg: rgb(15 20 25 / 10%);
}

.dark .music-dock {
  --music-dock-btn-border: rgb(255 255 255 / 14%);
  --music-dock-btn-bg: rgb(255 255 255 / 6%);
  --music-dock-btn-fg: rgb(242 244 246 / 78%);
  --music-dock-btn-border-hover: rgb(94 233 181 / 42%);
  --music-dock-btn-fg-hover: rgb(242 244 246 / 95%);
  --music-dock-btn-bg-hover: rgb(94 233 181 / 12%);
  --music-dock-progress-bg: rgb(255 255 255 / 10%);
}

@media (prefers-reduced-motion: reduce) {
  .music-dock__panel {
    backdrop-filter: none;
  }

  .music-dock__body {
    transition-duration: 0.01ms !important;
  }

  .music-dock__body > div > div {
    transition: none !important;
  }

  .music-dock__cover--playing img {
    animation: none;
  }

  .music-dock__btn--primary:active {
    transform: none;
  }
}
</style>
