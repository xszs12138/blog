<script setup lang="ts">
import { theme } from 'antdv-next'

const { token } = theme.useToken()
</script>

<template>
  <ClientOnly>
    <div class="wrapStyle min-w-0">
      <a-calendar :fullscreen="false" />
    </div>
    <template #fallback>
      <div class="wrapStyle min-w-0 min-h-72" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<style scoped>
.wrapStyle {
  width: 100%;
  max-width: 100%;
  border: 1px solid v-bind('token.colorBorder');
  border-radius: 8px;
}
</style>
