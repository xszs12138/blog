export interface GameListItem {
  id: number
  steamAppId: number
  name: string
  nameZh: string
  cover: string
  genres: string[] | null
  playStatus: string
  playStatusLabel?: string
  progressPercent: number | null
  playtimeHours: number
  playtime2WeeksHours: number
  lastPlayedAt: string | null
}

export interface GameGenreItem {
  slug: string
  name: string
  count: number
}

export interface GameRecentItem {
  id: number
  steamAppId: number
  name: string
  nameZh: string
  cover: string
  playtimeHours: number
  progressPercent: number | null
}

export interface GamePlaytimeMonth {
  month: string
  hours: number
}

export interface GamePlaytimeStats {
  totalHours: number
  months: GamePlaytimeMonth[]
}

export interface GameSidebar {
  recentGames: GameRecentItem[]
  playtimeStats: GamePlaytimeStats
}

export interface LiveBroadcast {
  isLive: boolean
  platform?: string
  platformLabel?: string
  roomTitle?: string
  streamTitle?: string
  subtitle?: string
  cover?: string
  streamUrl?: string
}

export interface DictItemOption {
  value: number
  code: string
  label: string
  sort: number
}

export type GameSortKey = 'recent' | 'playtime' | 'name'
