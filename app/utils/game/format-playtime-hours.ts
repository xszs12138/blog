/** 游戏时长展示，如 56h、12.5h */
export function formatPlaytimeHours(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) {
    return '0h'
  }
  if (hours >= 100) {
    return `${Math.round(hours)}h`
  }
  const rounded = Math.round(hours * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}h` : `${rounded}h`
}
