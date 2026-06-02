<script setup lang="ts">
import type { GamePlaytimeStats } from '~/types/game'
import { formatMonthLabel } from '~/utils/game/format-month-label'
import { formatPlaytimeHours } from '~/utils/game/format-playtime-hours'

const props = defineProps<{
  stats: GamePlaytimeStats
}>()

const months = computed(() => props.stats.months ?? [])

const maxHours = computed(() => {
  const values = months.value.map(item => item.hours)
  return Math.max(...values, 1)
})
</script>

<template>
  <BaseCard title="游戏时长统计" aria-label="游戏时长统计">
    <p class="mb-4 font-heading text-3xl font-bold tabular-nums tracking-tight text-foreground">
      {{ formatPlaytimeHours(stats.totalHours) }}
    </p>

    <div
      v-if="months.length"
      class="flex items-end justify-between gap-1.5 px-0.5"
      style="min-height: 6rem"
    >
      <div
        v-for="item in months"
        :key="item.month"
        class="flex min-w-0 flex-1 flex-col items-center gap-2"
      >
        <div
          class="w-full max-w-9 rounded-t-sm bg-accent"
          :style="{ height: `${Math.max(6, (item.hours / maxHours) * 80)}px` }"
          :title="`${formatMonthLabel(item.month)} ${formatPlaytimeHours(item.hours)}`"
        />
        <span class="text-[11px] text-muted-foreground">
          {{ formatMonthLabel(item.month) }}
        </span>
      </div>
    </div>
    <p v-else class="text-sm text-muted-foreground">
      同步 Steam 后将展示月度统计
    </p>
  </BaseCard>
</template>
