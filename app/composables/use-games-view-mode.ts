import type { GameViewMode } from '~/components/games/GameViewSwitcher.vue'

const STORAGE_KEY = 'xszs-games-view-mode'

function readStoredMode(): GameViewMode | null {
  if (!import.meta.client) {
    return null
  }
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw === 'grid' || raw === 'list' ? raw : null
}

/** 游戏库视图模式（纯客户端，不写 URL，避免切换时整页跳动） */
export function useGamesViewMode() {
  const viewMode = ref<GameViewMode>('grid')

  if (import.meta.client) {
    onMounted(() => {
      const stored = readStoredMode()
      if (stored) {
        viewMode.value = stored
      }
    })

    watch(viewMode, (value) => {
      localStorage.setItem(STORAGE_KEY, value)
    })
  }

  return viewMode
}
