import type { LrcLine, LyricsLoadStatus, MusicTrack, PlayMode } from '~/types/music'
import { createSharedComposable } from '@vueuse/core'
import { demoMusicPlaylist } from '~/config/music-demo'
import { formatDuration } from '~/utils/common/format-duration'
import { findLrcIndex } from '~/utils/music/find-lrc-index'
import { loadLyrics } from '~/utils/music/load-lyrics'

const PLAY_MODE_ORDER: PlayMode[] = ['list', 'one', 'random']

function playModeToIndex(mode: PlayMode): 0 | 1 | 2 {
  if (mode === 'one') {
    return 1
  }
  if (mode === 'random') {
    return 2
  }
  return 0
}

function indexToPlayMode(index: number): PlayMode {
  return PLAY_MODE_ORDER[index] ?? 'list'
}

function trackSrcMatches(el: HTMLAudioElement, track: MusicTrack): boolean {
  if (!el.src) {
    return false
  }
  try {
    const resolved = new URL(track.url, window.location.origin).href
    return el.src === resolved || el.currentSrc === resolved
  }
  catch {
    return el.src.endsWith(track.url)
  }
}

const useGlobalMusicPlayerState = createSharedComposable(() => {
  const tracks = ref<MusicTrack[]>([])
  const playlistReady = ref(false)

  const audioRef = ref<HTMLAudioElement | null>(null)
  const audioBound = ref(false)
  const currentIndex = ref(0)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const playModeIndex = ref<0 | 1 | 2>(playModeToIndex('list'))
  const lyrics = ref<LrcLine[]>([])
  const lyricsStatus = ref<LyricsLoadStatus>('none')
  const currentLrcIndex = ref(-1)
  const errorMessage = ref<string | null>(null)

  const volume = ref(0.7)
  const isMuted = ref(false)

  if (import.meta.client) {
    const stored = localStorage.getItem('music-player-volume')
    if (stored !== null) {
      volume.value = Number.parseFloat(stored)
    }
  }

  const playMode = computed(() => indexToPlayMode(playModeIndex.value))

  const currentTrack = computed(() => {
    const list = tracks.value
    return list[currentIndex.value] ?? list[0] ?? null
  })

  const progress = computed(() => {
    if (!duration.value) {
      return 0
    }
    return Math.min((currentTime.value / duration.value) * 100, 100)
  })

  const currentTimeText = computed(() => formatDuration(currentTime.value))
  const durationText = computed(() => formatDuration(duration.value))

  function persistVolume() {
    if (import.meta.client) {
      localStorage.setItem('music-player-volume', String(volume.value))
    }
  }

  function applyVolume() {
    const el = audioRef.value
    if (!el) {
      return
    }
    el.volume = volume.value
    el.muted = isMuted.value
  }

  async function loadLyricsForTrack(track: MusicTrack | null) {
    lyrics.value = []
    currentLrcIndex.value = -1

    if (!track?.lrc) {
      lyricsStatus.value = 'none'
      return
    }

    lyricsStatus.value = 'loading'
    const result = await loadLyrics(track.lrc)
    lyrics.value = result.lines
    lyricsStatus.value = result.status
    currentLrcIndex.value = findLrcIndex(lyrics.value, currentTime.value)
  }

  function syncLrcIndex() {
    if (!lyrics.value.length) {
      currentLrcIndex.value = -1
      return
    }
    const idx = findLrcIndex(lyrics.value, currentTime.value)
    if (idx !== currentLrcIndex.value) {
      currentLrcIndex.value = idx
    }
  }

  function loadTrack(index: number, autoPlay = false) {
    const list = tracks.value
    if (index < 0 || index >= list.length) {
      return
    }

    const track = list[index]
    if (!track) {
      return
    }

    currentIndex.value = index
    errorMessage.value = null

    const el = audioRef.value
    if (!el) {
      return
    }

    const sameSrc = trackSrcMatches(el, track)
    if (!sameSrc) {
      el.src = track.url
      el.load()
      currentTime.value = 0
      duration.value = 0
      void loadLyricsForTrack(track)
    }

    if (autoPlay) {
      void el.play().then(() => {
        isPlaying.value = true
      }).catch(() => {
        isPlaying.value = false
      })
    }
    else if (!sameSrc) {
      isPlaying.value = false
    }
  }

  function ensureTrackLoaded() {
    if (!audioRef.value || !tracks.value.length) {
      return
    }
    const track = currentTrack.value
    if (!track) {
      return
    }
    if (!trackSrcMatches(audioRef.value, track)) {
      loadTrack(currentIndex.value, false)
    }
    else {
      currentTime.value = audioRef.value.currentTime
      duration.value = audioRef.value.duration || duration.value
      isPlaying.value = !audioRef.value.paused
      applyVolume()
    }
  }

  async function loadPlaylist() {
    if (!import.meta.client) {
      return
    }
    try {
      const { getPlaylist } = useMusicApi()
      const res = await getPlaylist()
      tracks.value = res.items?.length ? res.items : [...demoMusicPlaylist]
    }
    catch {
      tracks.value = [...demoMusicPlaylist]
    }
    finally {
      playlistReady.value = true
      ensureTrackLoaded()
    }
  }

  if (import.meta.client) {
    void loadPlaylist()
  }

  function bindAudio(el: HTMLAudioElement | null) {
    audioRef.value = el
    if (!el) {
      return
    }
    applyVolume()
    if (!audioBound.value && tracks.value.length > 0) {
      audioBound.value = true
      if (playModeIndex.value === 2) {
        currentIndex.value = Math.floor(Math.random() * tracks.value.length)
      }
    }
    if (playlistReady.value) {
      ensureTrackLoaded()
    }
  }

  async function togglePlay() {
    const el = audioRef.value
    if (!el || !currentTrack.value) {
      return
    }

    if (!el.paused) {
      el.pause()
      return
    }

    try {
      await el.play()
      isPlaying.value = true
    }
    catch {
      isPlaying.value = false
      errorMessage.value = '无法播放音频'
    }
  }

  function playNext(fromEnded = false) {
    const list = tracks.value
    if (!list.length) {
      return
    }

    if (playModeIndex.value === 1 && fromEnded) {
      const el = audioRef.value
      if (el) {
        el.currentTime = 0
        void el.play()
      }
      return
    }

    let nextIndex: number
    if (playModeIndex.value === 2) {
      nextIndex = Math.floor(Math.random() * list.length)
    }
    else {
      nextIndex = (currentIndex.value + 1) % list.length
    }

    loadTrack(nextIndex, true)
  }

  function playPrev() {
    const list = tracks.value
    if (!list.length) {
      return
    }

    let prevIndex: number
    if (playModeIndex.value === 2) {
      prevIndex = Math.floor(Math.random() * list.length)
    }
    else {
      prevIndex = (currentIndex.value - 1 + list.length) % list.length
    }

    loadTrack(prevIndex, true)
  }

  function cyclePlayMode() {
    playModeIndex.value = ((playModeIndex.value + 1) % 3) as 0 | 1 | 2
  }

  function setVolume(val: number) {
    volume.value = Math.max(0, Math.min(1, val))
    isMuted.value = false
    applyVolume()
    persistVolume()
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
    applyVolume()
  }

  function seekByPercent(percent: number) {
    const el = audioRef.value
    if (!el || !el.duration) {
      return
    }
    el.currentTime = Math.max(0, Math.min(1, percent)) * el.duration
  }

  function playTrackByIndex(index: number) {
    if (index === currentIndex.value && isPlaying.value) {
      void togglePlay()
      return
    }
    loadTrack(index, true)
  }

  function onLoadedMetadata() {
    duration.value = audioRef.value?.duration || 0
    applyVolume()
  }

  function onTimeUpdate() {
    currentTime.value = audioRef.value?.currentTime || 0
    syncLrcIndex()
  }

  function onPlay() {
    isPlaying.value = true
  }

  function onPause() {
    isPlaying.value = false
  }

  function onEnded() {
    playNext(true)
  }

  function onError() {
    isPlaying.value = false
    errorMessage.value = '音频加载失败'
  }

  watch(
    tracks,
    (list) => {
      if (!list.length) {
        return
      }
      if (currentIndex.value >= list.length) {
        currentIndex.value = 0
      }
      if (import.meta.client && audioRef.value) {
        ensureTrackLoaded()
      }
    },
    { deep: true },
  )

  return {
    tracks: readonly(tracks),
    audioRef,
    bindAudio,
    currentIndex: readonly(currentIndex),
    currentTrack,
    isPlaying: readonly(isPlaying),
    currentTime: readonly(currentTime),
    duration: readonly(duration),
    progress,
    currentTimeText,
    durationText,
    playMode,
    playModeIndex: readonly(playModeIndex),
    volume: readonly(volume),
    isMuted: readonly(isMuted),
    lyrics: readonly(lyrics),
    lyricsStatus: readonly(lyricsStatus),
    currentLrcIndex: readonly(currentLrcIndex),
    errorMessage: readonly(errorMessage),
    togglePlay,
    playNext,
    playPrev,
    cyclePlayMode,
    setVolume,
    toggleMute,
    seekByPercent,
    playTrackByIndex,
    onLoadedMetadata,
    onTimeUpdate,
    onPlay,
    onPause,
    onEnded,
    onError,
  }
})

export function useGlobalMusicPlayer() {
  return useGlobalMusicPlayerState()
}
