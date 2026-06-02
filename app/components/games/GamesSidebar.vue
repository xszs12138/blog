<script setup lang="ts">
import type { GameSidebar } from '~/types/game'

import GameLiveNotice from '~/components/games/GameLiveNotice.vue'
import GameLivePanel from '~/components/games/GameLivePanel.vue'
import GamePlaytimePanel from '~/components/games/GamePlaytimePanel.vue'
import GameRecentPanel from '~/components/games/GameRecentPanel.vue'

const { getSidebar } = useGamesApi()

const {
  live,
  showLiveNotice,
  dismissLiveNotice,
  refreshLive,
} = await useGamesLive()

const { data: sidebar } = await useAsyncData('games-sidebar', async () => {
  try {
    return await getSidebar()
  }
  catch {
    return {
      recentGames: [],
      playtimeStats: { totalHours: 0, months: [] },
    } satisfies GameSidebar
  }
})
</script>

<template>
  <aside class="flex flex-col gap-5 xl:sticky xl:top-8  xl:self-start">
    <GameLivePanel v-if="live" :live="live" />
    <GameLiveNotice v-if="live" v-model="showLiveNotice" :live="live" @refresh="refreshLive"
      @dismiss="dismissLiveNotice" />
    <GameRecentPanel :items="sidebar?.recentGames ?? []" />
    <GamePlaytimePanel :stats="sidebar?.playtimeStats ?? { totalHours: 0, months: [] }" />
  </aside>
</template>
