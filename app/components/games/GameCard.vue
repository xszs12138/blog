<script setup lang="ts">
import type { GameListItem } from '~/types/game'
import GameCardMeta from '~/components/games/GameCardMeta.vue'
import GameSteamStoreLink from '~/components/games/GameSteamStoreLink.vue'
import GamesGlowShell from '~/components/games/GamesGlowShell.vue'

const props = defineProps<{
  game: GameListItem
  genreLabels?: Record<string, string>
}>()

const displayName = computed(
  () => props.game.nameZh?.trim() || props.game.name,
)

</script>

<template>
  <GameSteamStoreLink
    class="h-full"
    :steam-app-id="game.steamAppId"
    :title="displayName"
  >
    <GamesGlowShell class="h-full" inner-class="flex h-full min-h-60 flex-col">
    <div class="relative h-36 shrink-0 overflow-hidden bg-muted/25 sm:h-40">
      <img
        v-if="game.cover"
        :src="game.cover"
        :alt="`${displayName} 封面`"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        loading="lazy"
        decoding="async"
      >
      <div
        v-else
        class="flex size-full items-center justify-center text-sm text-muted-foreground"
      >
        暂无封面
      </div>

      <span
        v-if="game.playStatusLabel"
        class="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-1 text-xs font-medium text-white shadow-sm"
      >
        <span class="size-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />
        {{ game.playStatusLabel }}
      </span>
    </div>

    <div class="flex min-h-0 flex-1 flex-col p-4">
      <h3
        class="line-clamp-2 min-h-11 shrink-0 font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent"
        :title="displayName"
      >
        {{ displayName }}
      </h3>

      <GameCardMeta
        :genres="game.genres"
        :genre-labels="genreLabels"
        :playtime-hours="game.playtimeHours"
        :progress-percent="game.progressPercent"
      />
    </div>
    </GamesGlowShell>
  </GameSteamStoreLink>
</template>
