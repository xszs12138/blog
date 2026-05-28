import type { LrcLine, LyricsLoadStatus } from '~/types/music'
import { parseLrc } from '~/utils/music/parse-lrc'

export function isLrcSourceUrl(lrc: string): boolean {
  return (
    /^(https?:)?\/\//.test(lrc)
    || lrc.startsWith('/')
    || /\.(lrc|txt)(\?|#|$)/i.test(lrc)
  )
}

export async function loadLyrics(lrc?: string): Promise<{
  lines: LrcLine[]
  status: LyricsLoadStatus
}> {
  const source = lrc?.trim()
  if (!source) {
    return { lines: [], status: 'none' }
  }

  if (isLrcSourceUrl(source)) {
    try {
      const response = await fetch(source)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const text = await response.text()
      const lines = parseLrc(text)
      return {
        lines,
        status: lines.length > 0 ? 'loaded' : 'none',
      }
    }
    catch {
      return { lines: [], status: 'failed' }
    }
  }

  const lines = parseLrc(source)
  return {
    lines,
    status: lines.length > 0 ? 'loaded' : 'none',
  }
}
