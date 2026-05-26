/** 将阅读量格式化为 2.1k / 1.2w 等展示文案 */
export function formatViewCount(count: number): string {
  if (!Number.isFinite(count) || count < 0) {
    return '0'
  }
  if (count < 1000) {
    return String(count)
  }
  if (count < 10_000) {
    const value = count / 1000
    return `${value >= 10 ? Math.round(value) : value.toFixed(1).replace(/\.0$/, '')}k`
  }
  const value = count / 10_000
  return `${value >= 10 ? Math.round(value) : value.toFixed(1).replace(/\.0$/, '')}w`
}
