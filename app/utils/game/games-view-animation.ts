/** 与 games-page.css 中 .games-view 动画时长保持一致 */
export const GAMES_VIEW_ANIM = {
  enterDurationMs: 780,
  enterStaggerMs: 72,
  switchDurationMs: 560,
  switchStaggerMs: 58,
} as const

export function gamesViewAnimHoldMs(
  itemCount: number,
  mode: 'enter' | 'switch',
): number {
  const duration
    = mode === 'enter'
      ? GAMES_VIEW_ANIM.enterDurationMs
      : GAMES_VIEW_ANIM.switchDurationMs
  const stagger
    = mode === 'enter'
      ? GAMES_VIEW_ANIM.enterStaggerMs
      : GAMES_VIEW_ANIM.switchStaggerMs
  const total = duration + Math.max(0, itemCount - 1) * stagger
  // 须覆盖「最后一张卡的 delay + duration」，不能用 Math.min 截短否则类名会提前摘掉
  const maxCap = mode === 'enter' ? 2400 : 1600
  return Math.min(maxCap, total + 100)
}
