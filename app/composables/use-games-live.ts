import type { LiveBroadcast } from '~/types/game'

import { useDocumentVisibility, useIntervalFn, useWebSocket } from '@vueuse/core'

import { parseLiveWsMessage } from '~/types/live-ws'
import { buildLiveWebSocketUrl } from '~/utils/game/build-live-ws-url'

const LIVE_DATA_KEY = 'games-live'

function defaultLive(): LiveBroadcast {
  return { isLive: false }
}

/**
 * 游戏页直播：WebSocket 实时推送 + 断线时轮询兜底。
 */
export async function useGamesLive() {
  const route = useRoute()
  const config = useRuntimeConfig()
  const { getLive } = useGamesApi()

  const pollIntervalMs = Number(config.public.livePollIntervalMs) || 60_000
  const liveWsUrlOverride = String(config.public.liveWsUrl ?? '').trim()

  const { data: live, refresh, status } = await useAsyncData(
    LIVE_DATA_KEY,
    async () => {
      try {
        return await getLive()
      }
      catch {
        return defaultLive()
      }
    },
    { default: defaultLive },
  )

  const previousIsLive = ref<boolean | null>(null)
  const showLiveNotice = ref(false)

  function syncLiveNotice(next: LiveBroadcast) {
    const prev = previousIsLive.value
    if (prev === false && next.isLive) {
      showLiveNotice.value = true
    }
    previousIsLive.value = next.isLive
  }

  function applyLive(next: LiveBroadcast) {
    live.value = next
    syncLiveNotice(next)
  }

  watch(live, value => syncLiveNotice(value ?? defaultLive()), { immediate: true })

  async function pullLive() {
    try {
      await refresh()
    }
    catch {
      // 轮询/兜底失败时保持上次状态
    }
  }

  function dismissLiveNotice() {
    showLiveNotice.value = false
  }

  const isOnAir = computed(() => live.value?.isLive === true)

  const wsEnabled = computed(
    () => import.meta.client && route.path.startsWith('/games'),
  )

  const wsUrl = computed(() => {
    if (!wsEnabled.value) {
      return undefined
    }
    return buildLiveWebSocketUrl(
      String(config.public.apiBase),
      liveWsUrlOverride || undefined,
    )
  })

  const {
    status: wsStatus,
    data: wsData,
    open: openWs,
    close: closeWs,
  } = useWebSocket(wsUrl, {
    immediate: false,
    autoReconnect: {
      retries: 5,
      delay: 3000,
      onFailed() {
        void pullLive()
      },
    },
    onError() {
      // 避免未捕获错误；断线后由轮询兜底
    },
  })

  watch(wsData, (raw) => {
    if (!raw) {
      return
    }
    const next = parseLiveWsMessage(String(raw))
    if (next) {
      applyLive(next)
    }
  })

  function setWsConnection(active: boolean) {
    if (!active || !wsUrl.value) {
      closeWs()
      return
    }
    nextTick(() => {
      try {
        openWs()
      }
      catch {
        void pullLive()
      }
    })
  }

  watch(wsEnabled, setWsConnection, { immediate: true })

  if (import.meta.client) {
    onMounted(() => {
      void pullLive()
    })

    useIntervalFn(
      () => {
        if (!route.path.startsWith('/games')) {
          return
        }
        if (wsStatus.value === 'OPEN') {
          return
        }
        void pullLive()
      },
      pollIntervalMs,
      { immediate: false },
    )

    const visibility = useDocumentVisibility()
    watch(visibility, (state) => {
      if (state === 'visible' && route.path.startsWith('/games')) {
        if (wsStatus.value !== 'OPEN') {
          void pullLive()
        }
        setWsConnection(true)
      }
    })
  }

  return {
    live,
    status,
    isOnAir,
    wsStatus,
    showLiveNotice,
    dismissLiveNotice,
    refreshLive: pullLive,
  }
}
