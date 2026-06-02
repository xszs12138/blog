import type { LiveBroadcast } from '~/types/game'

export const LIVE_WS_TYPE_UPDATED = 'live.updated'

export interface LiveWsMessage {
  type: typeof LIVE_WS_TYPE_UPDATED
  data: LiveBroadcast
}

export function parseLiveWsMessage(raw: string): LiveBroadcast | null {
  try {
    const body = JSON.parse(raw) as LiveWsMessage
    if (body?.type === LIVE_WS_TYPE_UPDATED && body.data) {
      return body.data
    }
  }
  catch {
    // ignore malformed frames
  }
  return null
}
