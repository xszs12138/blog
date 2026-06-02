import type { PageParams, PageResult } from '~/types/api'
import type {
  DictItemOption,
  GameGenreItem,
  GameListItem,
  GameSidebar,
  LiveBroadcast,
} from '~/types/game'

export interface GetGamesParams extends PageParams {
  genre?: string
  status?: string
  sort?: string
}

export function useGamesApi() {
  const api = useApiClient()

  return {
    getGames: (params?: GetGamesParams) =>
      api<PageResult<GameListItem>>('/web/games', { query: params }),

    getGenres: () => api<GameGenreItem[]>('/web/games/genres'),

    getSidebar: () => api<GameSidebar>('/web/games/sidebar'),

    getLive: () => api<LiveBroadcast>('/web/live'),

    getGameGenreDict: () =>
      api<DictItemOption[]>('/web/dictionaries/game-genre/items'),
  }
}
