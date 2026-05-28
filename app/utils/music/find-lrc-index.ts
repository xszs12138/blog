import type { LrcLine } from '~/types/music'

/** 根据当前播放时间找到应高亮的歌词行索引 */
export function findLrcIndex(lyrics: LrcLine[], currentTime: number): number {
  if (!lyrics.length) {
    return -1
  }

  let index = -1
  for (let i = 0; i < lyrics.length; i++) {
    const line = lyrics[i]
    if (line && currentTime >= line.time) {
      index = i
    }
    else {
      break
    }
  }
  return index
}
