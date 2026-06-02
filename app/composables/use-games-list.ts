import type { PageResult } from '~/types/api'
import type { GameListItem, GameSortKey } from '~/types/game'

export interface UseGamesListOptions {
  pageSize?: number
  keyPrefix?: string
}

function queryParam(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export async function useGamesList(options: UseGamesListOptions = {}) {
  const pageSize = options.pageSize ?? 12
  const keyPrefix = options.keyPrefix ?? 'games'

  const route = useRoute()
  const router = useRouter()
  const { getGames } = useGamesApi()

  const genre = computed(() => {
    const value = queryParam(route.query.genre)
    return value === 'all' ? undefined : value
  })
  const status = computed(() => queryParam(route.query.status))
  const sort = computed<GameSortKey>(() => {
    const value = queryParam(route.query.sort)
    if (value === 'playtime' || value === 'name') {
      return value
    }
    return 'recent'
  })
  const playingOnly = computed(() => status.value === 'playing')

  const page = computed({
    get: () => {
      const raw = Number(route.query.page)
      return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1
    },
    set: (value: number) => {
      const next = Math.max(1, value)
      const query = { ...route.query }
      if (next === 1) {
        delete query.page
      }
      else {
        query.page = String(next)
      }
      router.push({ path: route.path, query })
    },
  })

  const listKey = computed(
    () =>
      `${keyPrefix}-${page.value}-${genre.value ?? ''}-${status.value ?? ''}-${sort.value}-${pageSize}`,
  )

  const { data, status: fetchStatus, refresh } = await useAsyncData(
    () => listKey.value,
    async () => {
      try {
        return await getGames({
          page: page.value,
          pageSize,
          genre: genre.value,
          status: playingOnly.value ? 'playing' : undefined,
          sort: sort.value,
        })
      }
      catch {
        return { items: [], total: 0 } satisfies PageResult<GameListItem>
      }
    },
    { watch: [page, genre, status, sort] },
  )

  const games = computed(() => data.value?.items ?? [])
  const total = computed(() => data.value?.total ?? 0)
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / pageSize)),
  )

  function setGenre(slug: string) {
    const query = { ...route.query }
    if (!slug || slug === 'all') {
      delete query.genre
    }
    else {
      query.genre = slug
    }
    delete query.page
    router.push({ path: route.path, query })
  }

  function setSort(next: GameSortKey) {
    const query = { ...route.query }
    if (next === 'recent') {
      delete query.sort
    }
    else {
      query.sort = next
    }
    delete query.page
    router.push({ path: route.path, query })
  }

  function togglePlayingOnly() {
    const query = { ...route.query }
    if (playingOnly.value) {
      delete query.status
    }
    else {
      query.status = 'playing'
    }
    delete query.page
    router.push({ path: route.path, query })
  }

  if (import.meta.client) {
    watch(page, () => {
      nextTick(() => {
        document.getElementById('games')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    })
  }

  return {
    page,
    games,
    total,
    totalPages,
    fetchStatus,
    refresh,
    genre,
    sort,
    playingOnly,
    pageSize,
    setGenre,
    setSort,
    togglePlayingOnly,
  }
}
