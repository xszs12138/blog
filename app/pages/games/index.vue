<script setup lang="ts">
import GameGrid from '~/components/games/GameGrid.vue'
import GamesSidebar from '~/components/games/GamesSidebar.vue'

definePageMeta({
  layout: 'default',
})

const viewMode = useGamesViewMode()

useHead({
  title: 'Games | xsZs Blog',
  meta: [
    {
      name: 'description',
      content: '记录游玩的游戏与旅程，分享快乐。',
    },
  ],
})
</script>

<template>
  <div class="games-page min-h-screen bg-background text-foreground">
    <div class="mx-auto w-full max-w-400 px-4 pb-16 pt-24 sm:px-6 lg:px-10 xl:px-12">
      <div class="flex flex-col gap-8 xl:grid xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-start  xl:gap-10">
        <GameGrid v-model:view-mode="viewMode" />
        <GamesSidebar />
      </div>
    </div>
  </div>
</template>
