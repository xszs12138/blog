<script setup lang="ts">
import type { LiveBroadcast } from '~/types/game'

import GameGenreTag from '~/components/games/GameGenreTag.vue'
import GameLiveTag from '~/components/games/GameLiveTag.vue'

const props = defineProps<{
  live: LiveBroadcast
}>()

const isOnAir = computed(() => props.live.isLive === true)

const tagLabel = computed(() => {
  const subtitle = props.live.subtitle?.trim()
  if (subtitle) {
    return subtitle
  }
  const room = props.live.roomTitle?.trim()
  if (room) {
    return room
  }
  return props.live.platformLabel?.trim() ?? ''
})

const displayTitle = computed(() => {
  const stream = props.live.streamTitle?.trim()
  if (stream) {
    return stream
  }
  const room = props.live.roomTitle?.trim()
  if (room) {
    return room
  }
  return isOnAir.value ? '直播中' : '直播间'
})

const statusLabel = computed(() =>
  isOnAir.value ? '正在直播' : '暂未开播',
)

const bodyLinkProps = computed(() => {
  if (!props.live.streamUrl) {
    return {}
  }
  return {
    href: props.live.streamUrl,
    target: '_blank',
    rel: 'noopener noreferrer',
  }
})

const bodyClickable = computed(() => Boolean(props.live.streamUrl))
</script>

<template>
  <BaseCard aria-label="直播">
    <div class="mb-4 flex items-center justify-between gap-3">
      <GameLiveTag
        :is-live="isOnAir"
        :label="isOnAir ? 'LIVE 开播中' : undefined"
      />
      <a v-if="live.streamUrl" :href="live.streamUrl" target="_blank" rel="noopener noreferrer"
        class="shrink-0 text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
        去直播间 →
      </a>
    </div>

    <component :is="bodyClickable ? 'a' : 'div'" v-bind="bodyLinkProps"
      class="flex gap-3.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      :class="bodyClickable ? 'group' : ''">
      <div class="size-19 shrink-0 overflow-hidden rounded-xl bg-muted/30 sm:size-20"
        :class="{ 'opacity-80 grayscale-[0.15]': !isOnAir }">
        <img v-if="live.cover" :src="live.cover" :alt="displayTitle"
          class="size-full object-cover transition-transform duration-500"
          :class="bodyClickable ? 'group-hover:scale-[1.03]' : ''" loading="lazy" decoding="async">
        <div v-else class="flex size-full items-center justify-center text-xs text-muted-foreground">
          直播封面
        </div>
      </div>

      <div class="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-0.5">
        <p class="text-xs text-muted-foreground">
          {{ statusLabel }}
        </p>
        <h3 class="line-clamp-2 font-heading text-sm font-semibold leading-snug text-foreground transition-colors"
          :class="bodyClickable ? 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400' : ''">
          {{ displayTitle }}
        </h3>
        <GameGenreTag v-if="tagLabel" class="mt-0.5 max-w-full self-start" :title="tagLabel">
          {{ tagLabel }}
        </GameGenreTag>
      </div>
    </component>
  </BaseCard>
</template>
