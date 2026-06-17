// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'

const devApiProxyTarget = process.env.NUXT_DEV_PROXY_TARGET
  || 'http://127.0.0.1:8080/api' // 本地
// || 'https://tjausbj.com.cn/api' // 线上

function devLiveWebSocketUrl(httpApiBase: string): string {
  const url = new URL(httpApiBase)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  const basePath = url.pathname.replace(/\/$/, '')
  url.pathname = `${basePath}/web/live/ws`
  url.search = ''
  url.hash = ''
  return url.toString()
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  routeRules: {
    '/': { redirect: '/home' },
    '/alums': { redirect: '/albums' },
  },
  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@antdv-next/nuxt',
  ],
  antd: {
    icon: false,
    include: [
      'Button',
      'Calendar',
      'Col',
      'Drawer',
      'Empty',
      'Input',
      'Masonry',
      'Menu',
      'Modal',
      'Pagination',
      'RadioButton',
      'RadioGroup',
      'Row',
      'Segmented',
      'Select',
      'Spin',
    ],
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  css: [
    '~/assets/css/antd.css',
    '~/assets/css/tailwind.css',
  ],
  runtimeConfig: {
    /** SSR 请求 API 的绝对地址 */
    apiBase: process.env.NUXT_API_BASE || 'http://127.0.0.1:8080/api',
    public: {
      /** 浏览器端 API 基址 */
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      /** WebSocket 不可用时的轮询兜底间隔（毫秒） */
      livePollIntervalMs: Number(process.env.NUXT_PUBLIC_LIVE_POLL_INTERVAL_MS) || 60_000,
      /**
       * 直播 WebSocket 直连地址。开发环境默认直连 Go，避免走 Nitro devProxy(ws)
       * 时后端断连导致 ECONNRESET 并触发 Nuxt 开发服务重启。
       */
      liveWsUrl: process.env.NUXT_PUBLIC_LIVE_WS_URL
        || (process.env.NODE_ENV !== 'production' ? devLiveWebSocketUrl(devApiProxyTarget) : ''),
      /** 是否启用 Live2D 看板娘（wl-live2d） */
      live2dEnabled: process.env.NUXT_PUBLIC_LIVE2D_ENABLED !== 'false',
      /** 是否启用 canvas 粒子连线背景 */
      canvasNestEnabled: process.env.NUXT_PUBLIC_CANVAS_NEST_ENABLED !== 'false',
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@lucide/vue',
        'antdv-next',
        'antdv-next/locale/zh_CN',
        'clsx',
        'dayjs',
        'md-editor-v3',
        'echarts',
        'echarts/core',
        'tailwind-merge',
        'wl-live2d',
      ],
    },
    ssr: {
      // wl-live2d 的 ESM 构建在 Node 侧使用 __dirname，禁止 SSR 解析
      external: ['wl-live2d'],
    },
  },
  nitro: {
    devProxy: {
      '/api': {
        target: devApiProxyTarget,
        changeOrigin: true,
        // 直播 WS 使用 public.liveWsUrl 直连后端；HTTP 代理不升级 WebSocket，避免 dev 进程被断连打崩
        ws: false,
      },
    },
  },
})
