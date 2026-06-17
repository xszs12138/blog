<script setup lang="ts">
import { h } from 'vue'

import { navItems } from '~/config/nav-items'

const route = useRoute()
const { isOpen, close } = useMobileNavDrawer()

const selectedKeys = computed(() => {
  const active = navItems.find(item => item.match(route.path))
  return active ? [active.to] : []
})

const menuItems = computed(() =>
  navItems.map(item => ({
    key: item.to,
    label: item.label,
    icon: () => h(item.icon, { class: 'size-4', 'aria-hidden': true }),
  })),
)

function onMenuClick(info: { key: string | number }) {
  close()
  navigateTo(String(info.key))
}

watch(() => route.path, () => {
  if (isOpen.value) {
    close()
  }
})
</script>

<template>
  <ADrawer
    :open="isOpen"
    title="菜单"
    placement="left"
    size="min(85vw, 18rem)"
    :z-index="100"
    @close="close"
  >
    <AMenu
      mode="inline"
      :selected-keys="selectedKeys"
      :items="menuItems"
      @click="onMenuClick"
    />
  </ADrawer>
</template>
