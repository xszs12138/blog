// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  routeRules: {
    '/': { redirect: '/home' },
  },
  modules: ['@nuxt/eslint', 'shadcn-nuxt', '@vueuse/nuxt'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  css: ['~/assets/css/tailwind.css'],
  runtimeConfig: {
    /** SSR 请求 API 的绝对地址 */
    apiBase: process.env.NUXT_API_BASE || 'http://127.0.0.1:8080/api',
    public: {
      /** 浏览器端 API 基址 */
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'class-variance-authority',
        'clsx',
        'reka-ui',
        'tailwind-merge',
      ],
    },
  },
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_DEV_PROXY_TARGET || 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
})
