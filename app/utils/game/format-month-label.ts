/** 2026-03 → 3月 */
export function formatMonthLabel(month?: string | null): string {
  if (!month) {
    return ''
  }
  const parts = month.split('-')
  const m = Number(parts[1])
  if (!Number.isFinite(m) || m < 1 || m > 12) {
    return month
  }
  return `${m}月`
}
