<script setup lang="ts">
import { LayoutGrid, List } from '@lucide/vue'
import { h } from 'vue'

export type GameViewMode = 'grid' | 'list'

const model = defineModel<GameViewMode>({ default: 'grid' })

const options: { value: GameViewMode, label: ReturnType<typeof h> }[] = [
  {
    value: 'grid',
    label: h('span', { class: 'inline-flex items-center gap-1.5' }, [
      h(LayoutGrid, { class: 'size-4' }),
      '网格视图',
    ]),
  },
  {
    value: 'list',
    label: h('span', { class: 'inline-flex items-center gap-1.5' }, [
      h(List, { class: 'size-4' }),
      '列表视图',
    ]),
  },
]
</script>

<template>
  <ASegmented v-model:value="model" size="large" :options="options" aria-label="视图切换" class="games-view-segmented" />
</template>

<style scoped>
:deep(.games-view-segmented.ant-segmented) {
  background: transparent;
  padding: 0;
}

:deep(.games-view-segmented .ant-segmented-item) {
  border-radius: 999px;
}

:deep(.games-view-segmented .ant-segmented-item-label) {
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
}
</style>
