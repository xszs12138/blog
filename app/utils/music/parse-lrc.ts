import type { LrcLine } from '~/types/music'

const TIME_REG = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g

/** 解析 LRC 歌词文本为带时间轴的行 */
export function parseLrc(lrc: string): LrcLine[] {
  if (!lrc.trim()) {
    return []
  }

  const result: LrcLine[] = []

  for (const line of lrc.split('\n')) {
    const matches = [...line.matchAll(TIME_REG)]
    if (matches.length === 0) {
      continue
    }

    const text = line.replace(TIME_REG, '').trim()
    if (!text) {
      continue
    }

    for (const match of matches) {
      const minutes = Number.parseInt(match[1] ?? '0', 10)
      const seconds = Number.parseInt(match[2] ?? '0', 10)
      const msRaw = match[3] ?? '0'
      const ms = Number.parseInt(msRaw, 10)
      const msDivisor = msRaw.length === 3 ? 1000 : 100
      const time = minutes * 60 + seconds + ms / msDivisor
      result.push({ time, text })
    }
  }

  return result.sort((a, b) => a.time - b.time)
}
