export interface LrcLine {
  time: number
  text: string
}

export interface MusicTrack {
  id: string
  name: string
  artist: string
  url: string
  cover?: string
  /** LRC 文本、相对路径或完整 URL */
  lrc?: string
}

export type PlayMode = 'list' | 'one' | 'random'

export type LyricsLoadStatus = 'none' | 'loading' | 'loaded' | 'failed'
