import type { MusicTrack } from '~/types/music'

export interface WebMusicPlaylist {
  items: MusicTrack[]
}

export function useMusicApi() {
  const api = useApiClient()

  return {
    getPlaylist: () => api<WebMusicPlaylist>('/web/music/playlist'),
  }
}
