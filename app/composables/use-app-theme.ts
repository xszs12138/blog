import { useColorMode } from '@vueuse/core'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'xszs-color-mode'

/**
 * 博客主题：light / dark / system（跟随系统）
 * - `preference`：用户选择，可含 system
 * - `resolvedTheme`：实际应用到 html 的 light | dark
 */
export function useAppTheme() {
  const colorMode = useColorMode({
    attribute: 'class',
    modes: {
      light: '',
      dark: 'dark',
    },
    storageKey: STORAGE_KEY,
    initialValue: 'dark',
  })

  const preference = computed<ThemePreference>({
    get() {
      const p = colorMode.store.value
      return p === 'auto' ? 'system' : (p as 'light' | 'dark')
    },
    set(next) {
      colorMode.store.value = next === 'system' ? 'auto' : next
    },
  })

  const resolvedTheme = computed<'light' | 'dark'>(() =>
    colorMode.state.value === 'dark' ? 'dark' : 'light',
  )

  const isDark = computed(() => resolvedTheme.value === 'dark')

  function setTheme(next: ThemePreference) {
    colorMode.store.value = next === 'system' ? 'auto' : next
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return {
    colorMode,
    preference,
    resolvedTheme,
    isDark,
    setTheme,
    toggleTheme,
  }
}

/** @deprecated 使用 useAppTheme */
export function useAppColorMode() {
  return useAppTheme().colorMode
}
