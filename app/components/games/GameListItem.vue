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
    :steam-app-id="game.steamAppId"
    :title="displayName"
  >
    <GamesGlowShell inner-class="flex gap-4 p-3 sm:gap-5 sm:p-4">
    <div class="relative aspect-460/215 w-36 shrink-0 overflow-hidden rounded-xl bg-muted/25 sm:w-44">
      <img
        v-if="game.cover"
        :src="game.cover"
        :alt="`${displayName} 封面`"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        decoding="async"
      >
      <div
        v-else
        class="flex size-full items-center justify-center text-xs text-muted-foreground"
      >
        暂无封面
      </div>

      <span
        v-if="game.playStatusLabel"
        class="absolute right-2 top-2 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-medium text-white"
      >
        {{ game.playStatusLabel }}
      </span>
    </div>

    <div class="flex min-w-0 flex-1 flex-col justify-center">
      <h3
        class="line-clamp-2 font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent"
        :title="displayName"
      >
        {{ displayName }}
      </h3>

      <GameCardMeta
        class="max-w-md"
        :genres="game.genres"
        :genre-labels="genreLabels"
        :playtime-hours="game.playtimeHours"
        :progress-percent="game.progressPercent"
      />
    </div>
    </GamesGlowShell>
  </GameSteamStoreLink>
</template>
