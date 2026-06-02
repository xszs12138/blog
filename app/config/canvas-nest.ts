export interface CanvasNestPreset {
  /** 线条 RGB，不含 alpha */
  color: string
  /** 整层 canvas 透明度 */
  opacity: number
  particleCount: number
  zIndex: number
  /** 粒子点不透明度 */
  dotAlpha: number
  /** 连线透明度区间 */
  lineAlphaMin: number
  lineAlphaMax: number
  /** 连线最小线宽（px） */
  lineWidthMin: number
  lineWidthMax: number
}

/** 浅色：深一点的薄荷绿，在 #eef5ee 背景上可辨认 */
export const canvasNestLight: CanvasNestPreset = {
  color: '58,128,88',
  opacity: 0.88,
  particleCount: 72,
  zIndex: 0,
  dotAlpha: 0.55,
  lineAlphaMin: 0.28,
  lineAlphaMax: 0.72,
  lineWidthMin: 0.45,
  lineWidthMax: 1.15,
}

/** 暗色：更亮的青绿线条 */
export const canvasNestDark: CanvasNestPreset = {
  color: '130,245,200',
  opacity: 0.75,
  particleCount: 68,
  zIndex: 0,
  dotAlpha: 0.5,
  lineAlphaMin: 0.22,
  lineAlphaMax: 0.65,
  lineWidthMin: 0.4,
  lineWidthMax: 1.05,
}
