<script setup lang="ts">
import GameGenreTag from '~/components/games/GameGenreTag.vue'
import { cn } from '~/utils/common/cn'
import { formatPlaytimeHours } from '~/utils/game/format-playtime-hours'
import { normalizeGenres } from '~/utils/game/normalize-genres'

const props = defineProps<{
  genres: string[] | null
  genreLabels?: Record<string, string>
  playtimeHours: number
  progressPercent?: number | null
  class?: string
}>()

const genreTags = computed(() =>
  normalizeGenres(props.genres).map(code => ({
    code,
    label: props.genreLabels?.[code] ?? code,
  })),
)

const showProgress = computed(
  () =>
    props.progressPercent !== null
    && props.progressPercent !== undefined,
)
</script>

<template>
  <div :class="cn('mt-auto space-y-2 pt-3', props.class)">
    <div
      v-if="genreTags.length"
      class="games-card-meta__tags flex gap-1.5 overflow-x-auto pb-0.5"
    >
      <GameGenreTag
        v-for="tag in genreTags"
        :key="tag.code"
        :title="tag.label"
      >
        {{ tag.label }}
      </GameGenreTag>
    </div>

    <div class="flex items-center justify-between gap-2 text-xs">
      <span
        v-if="showProgress"
        class="text-muted-foreground"
      >
        进度 {{ progressPercent }}%
      </span>
      <span
        class="tabular-nums font-medium text-foreground"
        :class="showProgress ? '' : 'ml-auto'"
      >
        {{ formatPlaytimeHours(playtimeHours) }}
      </span>
    </div>

    <div
      v-if="showProgress"
      class="h-1.5 overflow-hidden rounded-full bg-[var(--games-progress-track)]"
      role="progressbar"
      :aria-valuenow="progressPercent ?? 0"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`游戏进度 ${progressPercent}%`"
    >
      <div
        class="h-full rounded-full bg-accent transition-[width] duration-500"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>
  </div>
</template>
