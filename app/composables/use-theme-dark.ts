import { createSharedComposable, useDark } from '@vueuse/core'

import { THEME_STORAGE_KEY } from '~/config/theme'

/**
 * 全站共享暗色状态：
 * - 基于 VueUse useDark
 * - 统一使用 xszs-color-mode
 * - 同步 cookie 供 SSR 首屏读取，避免 hydration mismatch
 */
export const useThemeDark = createSharedComposable(() => {
  const preferenceCookie = useCookie<string | null>(THEME_STORAGE_KEY, {
    default: () => 'dark',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  return useDark({
    storageKey: THEME_STORAGE_KEY,
    storage: {
      getItem(_key: string) {
        return preferenceCookie.value ?? null
      },
      setItem(_key: string, value: string) {
        preferenceCookie.value = value
        if (import.meta.client) {
          try {
            localStorage.setItem(THEME_STORAGE_KEY, value)
          }
          catch {
            // ignore private mode / quota errors
          }
        }
      },
      removeItem(_key: string) {
        preferenceCookie.value = null
        if (import.meta.client) {
          try {
            localStorage.removeItem(THEME_STORAGE_KEY)
          }
          catch {
            // ignore private mode / quota errors
          }
        }
      },
    },
  })
})
