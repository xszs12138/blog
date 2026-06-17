<script setup lang="ts">
import { Menu } from '@lucide/vue'

const { open } = useMobileNavDrawer()
</script>

<template>
  <BaseIconButton class="lg:hidden!" label="打开菜单" @click="open">
    <Menu class="size-4" aria-hidden="true" />
  </BaseIconButton>
</template>
