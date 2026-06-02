export interface BorderBeamGradientItem {
  color: string
  percent: number
}

export type BorderBeamGradient = BorderBeamGradientItem[]
export type BorderBeamColor = string | BorderBeamGradient

/** 可见光束段占渐变总长比例，尾部保留透明区 */
export const MAX_BEAM_COLOR_STOP_PERCENT = 70

export const DEFAULT_BORDER_BEAM_COLOR: BorderBeamGradient = [
  { color: 'rgb(136 192 150 / 15%)', percent: 0 },
  { color: 'rgb(136 192 150 / 95%)', percent: 45 },
  { color: 'rgb(210 255 218)', percent: 55 },
  { color: 'rgb(136 192 150 / 95%)', percent: 65 },
]

function getLinearGradient(...colorStops: string[]): string {
  return `linear-gradient(to left, ${colorStops.join(', ')}, transparent)`
}

function normalizeBorderBeamColor(value?: BorderBeamColor): BorderBeamGradient {
  if (typeof value === 'string') {
    return [{ color: value, percent: 0 }]
  }
  return value ?? DEFAULT_BORDER_BEAM_COLOR
}

function fillGradientEnd(items: BorderBeamGradient): BorderBeamGradient {
  const lastItem = items[items.length - 1]
  if (!lastItem || lastItem.percent === 100) {
    return items
  }
  return [...items, { ...lastItem, percent: 100 }]
}

function getMappedBeamColorStopPercent(percent: number): number {
  return Number(
    ((Math.min(Math.max(percent, 0), 100) / 100) * MAX_BEAM_COLOR_STOP_PERCENT).toFixed(2),
  )
}

function normalizeGradientItems(items: BorderBeamGradient) {
  return fillGradientEnd(items).map(item => ({
    ...item,
    percent: getMappedBeamColorStopPercent(item.percent),
  }))
}

export function getBorderBeamGradient(value?: BorderBeamColor): string | undefined {
  const normalizedStops = normalizeGradientItems(normalizeBorderBeamColor(value))
  if (!normalizedStops.length) {
    return undefined
  }
  return getLinearGradient(...normalizedStops.map(item => `${item.color} ${item.percent}%`))
}

export function getInsetOffset(width: number | string): string {
  return typeof width === 'string' ? `calc(-1 * ${width})` : `-${width}px`
}
