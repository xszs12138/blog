<script setup lang="ts">
import type { GameViewMode } from '~/components/games/GameViewSwitcher.vue'

import GameCard from '~/components/games/GameCard.vue'
import GameGenreFilter from '~/components/games/GameGenreFilter.vue'
import GameListItem from '~/components/games/GameListItem.vue'
import { gamesViewAnimHoldMs } from '~/utils/game/games-view-animation'

const props = defineProps<{
  viewMode: GameViewMode
}>()

const GAME_PAGE_SIZE = 12

const {
  page,
  games,
  totalPages,
  genre,
  setGenre,
} = await useGamesList({ pageSize: GAME_PAGE_SIZE })

const { getGenres, getGameGenreDict } = useGamesApi()

const { data: genres } = await useAsyncData('games-genres', async () => {
  try {
    return await getGenres()
  }
  catch {
    return []
  }
})

const { data: genreDict } = await useAsyncData('games-genre-dict', async () => {
  try {
    return await getGameGenreDict()
  }
  catch {
    return []
  }
})

const genreLabels = computed(() => {
  const map: Record<string, string> = {}
  for (const item of genreDict.value ?? []) {
    if (item.code) {
      map[item.code] = item.label
    }
  }
  for (const item of genres.value ?? []) {
    if (item.slug !== 'all') {
      map[item.slug] = item.name
    }
  }
  return map
})

const activeGenreSlug = computed(() => genre.value ?? 'all')
const isEmpty = computed(() => games.value.length === 0)

const viewClass = computed(() =>
  props.viewMode === 'list' ? 'games-view--list' : 'games-view--grid',
)

/** 首次进入 / 筛选分页换列表：卡片入场（依赖 class 摘挂重启 CSS animation） */
const enterActive = ref(false)
/** 网格 ↔ 列表：轻量过渡 */
const switchActive = ref(false)
let enterTimer: ReturnType<typeof setTimeout> | undefined
let switchTimer: ReturnType<typeof setTimeout> | undefined

function clearEnterTimer() {
  if (enterTimer) {
    clearTimeout(enterTimer)
    enterTimer = undefined
  }
}

function scheduleEnterEnd() {
  clearEnterTimer()
  const delay = gamesViewAnimHoldMs(games.value.length, 'enter')
  enterTimer = setTimeout(() => {
    enterActive.value = false
    enterTimer = undefined
  }, delay)
}

/** 先摘掉 enter 再挂回，否则 enterActive 已为 true 时换分类不会重播动画 */
function playEnterAnimation() {
  clearEnterTimer()
  enterActive.value = false

  nextTick(() => {
    requestAnimationFrame(() => {
      enterActive.value = true
      scheduleEnterEnd()
    })
  })
}

function scheduleSwitchAnim() {
  switchActive.value = true
  if (switchTimer) {
    clearTimeout(switchTimer)
  }
  const delay = gamesViewAnimHoldMs(games.value.length, 'switch')
  switchTimer = setTimeout(() => {
    switchActive.value = false
    switchTimer = undefined
  }, delay)
}

watch(
  () => props.viewMode,
  (next, prev) => {
    if (prev !== undefined && next !== prev) {
      scheduleSwitchAnim()
    }
  },
)

watch(
  () => games.value.map(g => g.id).join(','),
  () => {
    playEnterAnimation()
  },
)

onMounted(() => {
  playEnterAnimation()
})

onBeforeUnmount(() => {
  clearEnterTimer()
  if (switchTimer) {
    clearTimeout(switchTimer)
  }
})
</script>

<template>
  <section id="games" aria-label="游戏库">
    <GameGenreFilter v-if="genres?.length" :genres="genres" :active-slug="activeGenreSlug" class="mb-6"
      @select="setGenre" />
    <BaseEmptyState v-if="isEmpty" title="暂无游戏" description="呜呜呜，还没有游戏呢！" />
    <div v-else class="flex flex-col gap-8">
      <div class="games-view" :class="[
        viewClass,
        {
          'games-view--enter': enterActive,
          'games-view--switch': switchActive,
        },
      ]">
        <ul class="games-view__list list-none p-0">
          <li v-for="(game, index) in games" :key="game.id" class="games-view__item"
            :style="{ '--game-stagger': index }">
            <div class="games-view__panel games-view__panel--grid h-full">
              <GameCard :game="game" :genre-labels="genreLabels" />
            </div>
            <div class="games-view__panel games-view__panel--list">
              <GameListItem :game="game" :genre-labels="genreLabels" />
            </div>
          </li>
        </ul>
      </div>

      <footer v-if="totalPages > 1">
        <BasePagination :page="page" :total-pages="totalPages" aria-label="游戏分页" @update:page="page = $event" />
      </footer>
    </div>
  </section>
</template>
