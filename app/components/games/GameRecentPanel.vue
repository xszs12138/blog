<script setup lang="ts">
import type { GameRecentItem } from '~/types/game'
import { formatPlaytimeHours } from '~/utils/game/format-playtime-hours'

defineProps<{
  items: GameRecentItem[]
}>()

function displayName(item: GameRecentItem) {
  return item.nameZh?.trim() || item.name
}
</script>

<template>
  <BaseCard title="近期游戏" aria-label="近期游戏">
    <template #headerRight>
      <NuxtLink
        to="/games#games"
        class="mb-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        查看全部 →
      </NuxtLink>
    </template>

    <ul v-if="items.length" class="list-none space-y-3.5 p-0">
      <li
        v-for="item in items"
        :key="item.id"
        class="flex gap-3"
      >
        <div class="size-11 shrink-0 overflow-hidden rounded-lg bg-muted/30">
          <img
            v-if="item.cover"
            :src="item.cover"
            :alt="displayName(item)"
            class="size-full object-cover"
            loading="lazy"
          >
        </div>
        <div class="min-w-0 flex-1 pt-0.5">
          <p class="line-clamp-1 text-sm font-medium text-foreground">
            {{ displayName(item) }}
          </p>
          <p class="mt-0.5 text-xs text-muted-foreground">
            Steam · {{ formatPlaytimeHours(item.playtimeHours) }}
          </p>
          <div
            v-if="item.progressPercent !== null && item.progressPercent !== undefined"
            class="mt-2 h-1 overflow-hidden rounded-full bg-muted/40"
          >
            <div
              class="h-full rounded-full bg-accent"
              :style="{ width: `${item.progressPercent}%` }"
            />
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="text-sm text-muted-foreground">
      暂无近期游玩记录
    </p>
  </BaseCard>
</template>
