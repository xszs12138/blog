<script setup lang="ts">
import { Search } from '@lucide/vue'

const { open } = usePostSearchPanel()

const isMac = import.meta.client && /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)
const shortcutHint = computed(() => (isMac ? '⌘K' : 'Ctrl+K'))
</script>

<template>
  <BaseIconButton
    :aria-keyshortcuts="isMac ? 'Meta+K' : 'Control+K'"
    :label="`搜索文章（${shortcutHint}）`"
    @click="open"
  >
    <Search class="size-4" aria-hidden="true" />
  </BaseIconButton>
</template>
