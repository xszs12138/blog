/** 由 HTTP API 基址推导 WebSocket 地址（如 http://127.0.0.1:8080/api → ws://.../api/web/live/ws） */
export function buildLiveWebSocketUrlFromHttpBase(httpBase: string): string {
  const url = new URL(httpBase)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  const basePath = url.pathname.replace(/\/$/, '')
  url.pathname = `${basePath}/web/live/ws`
  url.search = ''
  url.hash = ''
  return url.toString()
}

/**
 * 浏览器端直播 WebSocket 地址。
 * 优先使用 `liveWsUrl`（开发环境应直连 Go，勿走 Nuxt devProxy 的 ws 代理）。
 */
export function buildLiveWebSocketUrl(apiBase: string, wsUrlOverride?: string): string {
  const override = wsUrlOverride?.trim()
  if (override) {
    return override
  }

  const base = apiBase.trim() || '/api'
  const origin
    = typeof window !== 'undefined'
      ? window.location.origin
      : 'http://127.0.0.1:3000'

  const url = new URL(base.startsWith('/') ? base : `${base}/`, origin)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  const path = url.pathname.replace(/\/$/, '')
  url.pathname = `${path}/web/live/ws`
  url.search = ''
  url.hash = ''
  return url.toString()
}
