/** 根据摘要长度估算阅读时长（分钟），仅用于展示 */
export function estimateReadingMinutes(summary?: string): number {
  const text = summary?.trim() ?? ''
  if (!text) {
    return 1
  }
  return Math.max(1, Math.ceil(text.length / 320))
}
