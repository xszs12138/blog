import { theme } from 'antdv-next'

const BLOG_ANTD_TOKENS = {
  light: {
    colorPrimary: '#76b876',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorText: '#2c3e50',
    colorTextSecondary: '#5f6f7a',
    colorBorder: 'rgb(76 130 88 / 16%)',
  },
  dark: {
    colorPrimary: '#5ee9b5',
    colorBgContainer: '#10151a',
    colorBgElevated: '#10151a',
    colorText: '#f2f4f6',
    colorTextSecondary: 'rgb(242 244 246 / 62%)',
    colorBorder: 'rgb(255 255 255 / 10%)',
  },
} as const

export function useAntdTheme() {
  const isDark = useThemeDark()

  return computed(() => {
    const palette = isDark.value ? BLOG_ANTD_TOKENS.dark : BLOG_ANTD_TOKENS.light

    return {
      algorithm: isDark.value
        ? [theme.darkAlgorithm]
        : [theme.defaultAlgorithm],
      token: {
        ...palette,
        borderRadius: 12,
        borderRadiusLG: 16,
        fontFamily: 'inherit',
      },
      components: {
        Button: {
          colorText: palette.colorTextSecondary,
          defaultBorderColor: palette.colorBorder,
          borderRadius: 999,
        },
        Drawer: {
          paddingLG: 16,
        },
        Menu: {
          itemBorderRadius: 8,
        },
      },
    }
  })
}
