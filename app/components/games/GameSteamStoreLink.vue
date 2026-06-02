<script setup lang="ts">
import { buildSteamStoreUrl } from '~/utils/game/build-steam-store-url'
import { cn } from '~/utils/common/cn'

const props = defineProps<{
  steamAppId: number
  title: string
  class?: string
}>()

const href = computed(() =>
  props.steamAppId > 0 ? buildSteamStoreUrl(props.steamAppId) : null,
)
</script>

<template>
  <a
    v-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="`在 Steam 商店查看 ${title}`"
    :class="cn(
      'group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      props.class,
    )"
  >
    <slot />
  </a>
  <div v-else :class="cn('group block', props.class)">
    <slot />
  </div>
</template>
