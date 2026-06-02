import type { CanvasNestPreset } from '~/config/canvas-nest'

/**
 * 经典 canvas 粒子连线背景（由 index.html 内联脚本整理为可销毁模块）
 */
export function startCanvasNest(options: CanvasNestPreset): () => void {
  if (!import.meta.client) {
    return () => {}
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return () => {}
  }

  canvas.className = 'canvas-nest-bg'
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100%',
    'height:100%',
    `z-index:${options.zIndex}`,
    `opacity:${options.opacity}`,
    'pointer-events:none',
  ].join(';')

  let width = 0
  let height = 0
  let rafId = 0
  let running = true

  const cursor = { x: null as number | null, y: null, max: 20_000 }

  type Particle = {
    x: number
    y: number
    xa: number
    ya: number
    max: number
  }

  let particles: Particle[] = []

  function resize() {
    width = canvas.width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth
    height = canvas.height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight
  }

  function seedParticles() {
    particles = []
    for (let i = 0; i < options.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        xa: 2 * Math.random() - 1,
        ya: 2 * Math.random() - 1,
        max: 6000,
      })
    }
  }

  function drawDot(x: number, y: number) {
    ctx.fillStyle = `rgba(${options.color},${options.dotAlpha})`
    ctx.beginPath()
    ctx.arc(x, y, 1.1, 0, Math.PI * 2)
    ctx.fill()
  }

  function draw() {
    if (!running) {
      return
    }

    ctx.clearRect(0, 0, width, height)

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]!
      p.x += p.xa
      p.y += p.ya
      if (p.x > width || p.x < 0) {
        p.xa *= -1
      }
      if (p.y > height || p.y < 0) {
        p.ya *= -1
      }

      drawDot(p.x, p.y)

      for (let j = i + 1; j < particles.length; j++) {
        drawLink(p, particles[j]!)
      }

      if (cursor.x !== null && cursor.y !== null) {
        drawLink(p, { x: cursor.x, y: cursor.y, max: cursor.max }, true)
      }
    }

    rafId = window.requestAnimationFrame(draw)
  }

  function drawLink(
    from: { x: number, y: number },
    to: { x: number, y: number, max: number },
    repelFromCursor = false,
  ) {
    const dx = from.x - to.x
    const dy = from.y - to.y
    const distSq = dx * dx + dy * dy
    if (distSq >= to.max) {
      return
    }

    if (repelFromCursor && distSq >= to.max / 2) {
      from.x -= dx * 0.03
      from.y -= dy * 0.03
    }

    const t = (to.max - distSq) / to.max
    const alpha = options.lineAlphaMin + t * (options.lineAlphaMax - options.lineAlphaMin)
    const lineWidth = options.lineWidthMin + t * (options.lineWidthMax - options.lineWidthMin)
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = `rgba(${options.color},${alpha})`
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }

  function onResize() {
    resize()
    seedParticles()
  }

  function onMouseMove(event: MouseEvent) {
    cursor.x = event.clientX
    cursor.y = event.clientY
  }

  function onMouseOut() {
    cursor.x = null
    cursor.y = null
  }

  document.body.appendChild(canvas)
  resize()
  seedParticles()

  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseout', onMouseOut)

  rafId = window.requestAnimationFrame(draw)

  return () => {
    running = false
    window.cancelAnimationFrame(rafId)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseout', onMouseOut)
    canvas.remove()
  }
}
