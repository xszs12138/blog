<script setup lang="ts">
import { App, ConfigProvider } from 'antdv-next'
import zhCn from 'antdv-next/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const antdTheme = useAntdTheme()
watch(
  antdTheme,
  (themeConfig) => {
    ConfigProvider.config({ theme: themeConfig })
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <ConfigProvider :theme="antdTheme" :locale="zhCn">
    <App class="blog-ant-app">
      <slot />
    </App>
  </ConfigProvider>
</template>
