<script setup lang="ts">
import type { LiveBroadcast } from '~/types/game'

import GameGenreTag from '~/components/games/GameGenreTag.vue'
import GameLiveTag from '~/components/games/GameLiveTag.vue'

const props = defineProps<{
  live: LiveBroadcast
}>()

const emit = defineEmits<{
  refresh: []
  dismiss: []
}>()

const open = defineModel<boolean>({ default: false })

const dialogRef = ref<HTMLDialogElement | null>(null)

const streamTitle = computed(
  () => props.live.streamTitle?.trim() || '主播开播啦',
)

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

watch(open, (value) => {
  const el = dialogRef.value
  if (!el) {
    return
  }
  if (value && !el.open) {
    el.showModal()
  }
  if (!value && el.open) {
    el.close()
  }
})

function onDialogClose() {
  open.value = false
  emit('dismiss')
}

async function onRefresh() {
  emit('refresh')
  open.value = false
}

function onDismiss() {
  open.value = false
  emit('dismiss')
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef"
      class="game-live-notice fixed inset-0 z-100 m-0 size-auto max-h-none max-w-none border-0 bg-transparent p-4 backdrop:bg-black/50 open:flex open:items-center open:justify-center"
      aria-labelledby="game-live-notice-title" aria-describedby="game-live-notice-desc" @close="onDialogClose">
      <div
        class="game-live-notice__panel w-full max-w-md overflow-hidden rounded-2xl border border-border bg-blog-card shadow-2xl dark:shadow-black/50"
        @click.stop>
        <div class="border-b border-border/60 px-5 pb-4 pt-5">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1 space-y-3">
              <GameLiveTag label="LIVE 开播中" />
              <div>
                <h2 id="game-live-notice-title"
                  class="font-heading text-lg font-semibold tracking-tight text-foreground">
                  开播提醒
                </h2>
                <p class="mt-1 text-xs text-muted-foreground">
                  主播刚刚开播，快去看看吧
                </p>
              </div>
            </div>
            <button type="button"
              class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              aria-label="关闭" @click="onDismiss">
              <span class="text-lg leading-none" aria-hidden="true">×</span>
            </button>
          </div>
        </div>

        <div class="px-5 py-4">
          <div class="flex gap-3.5 rounded-xl border border-border/50 bg-muted/15 p-3">
            <div class="size-17 shrink-0 overflow-hidden rounded-lg bg-muted/30 sm:size-20">
              <img v-if="live.cover" :src="live.cover" :alt="streamTitle" class="size-full object-cover" loading="lazy"
                decoding="async">
              <div v-else class="flex size-full items-center justify-center text-[10px] text-muted-foreground">
                封面
              </div>
            </div>

            <div class="flex min-w-0 flex-1 flex-col justify-center gap-1">
              <p class="text-xs text-muted-foreground">
                正在直播
              </p>
              <p id="game-live-notice-desc"
                class="line-clamp-2 font-heading text-sm font-semibold leading-snug text-foreground">
                {{ streamTitle }}
              </p>
              <GameGenreTag v-if="tagLabel" class="mt-0.5 max-w-full self-start" :title="tagLabel">
                {{ tagLabel }}
              </GameGenreTag>
            </div>
          </div>

          <div class="mt-5 flex flex-col gap-2.5">
            <button type="button"
              class="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition-opacity hover:opacity-90"
              @click="onRefresh">
              刷新直播信息
            </button>
            <div class="flex gap-2.5">
              <a v-if="live.streamUrl" :href="live.streamUrl" target="_blank" rel="noopener noreferrer"
                class="inline-flex flex-1 items-center justify-center rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
                @click="onDismiss">
                去直播间
              </a>
              <button type="button"
                class="inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                :class="live.streamUrl ? '' : 'w-full'" @click="onDismiss">
                知道了
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.game-live-notice::backdrop {
  background: rgb(0 0 0 / 50%);
  backdrop-filter: blur(2px);
}

.game-live-notice__panel {
  animation: game-live-notice-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes game-live-notice-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .game-live-notice__panel {
    animation: none;
  }
}
</style>
