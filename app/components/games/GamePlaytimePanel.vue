<script setup lang="ts">
import type { GamePlaytimeStats } from '~/types/game'
import GamePlaytimeBarChart from '~/components/games/GamePlaytimeBarChart.client.vue'

const props = defineProps<{
  stats: GamePlaytimeStats
}>()

const months = computed(() => props.stats.months ?? [])
</script>

<template>
  <BaseCard title="游戏时长统计" aria-label="游戏时长统计">
    <GamePlaytimeBarChart v-if="months.length" :months="months" />
  </BaseCard>
</template>
