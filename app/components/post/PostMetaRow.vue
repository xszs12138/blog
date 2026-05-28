<script setup lang="ts">
import { Bookmark, Calendar, Clock, Eye } from '@lucide/vue'
import { estimateReadingMinutes } from '~/utils/post/estimate-reading-minutes'
import { formatPostDate } from '~/utils/common/format-post-date'
import { formatViewCount } from '~/utils/common/format-view-count'

const props = defineProps<{
  publishedAt?: string
  summary?: string
  viewCount: number
}>()

const dateLabel = computed(() => formatPostDate(props.publishedAt))
const readingLabel = computed(() => `${estimateReadingMinutes(props.summary)} 分钟`)
const viewsLabel = computed(() => `${formatViewCount(props.viewCount)} 阅读`)
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
    <PostMetaItem v-if="dateLabel" :icon="Calendar" :label="dateLabel" />
    <PostMetaItem :icon="Clock" :label="readingLabel" />
    <PostMetaItem :icon="Eye" :label="viewsLabel" />
    <button
      type="button"
      class="ml-auto inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
      aria-label="收藏文章（即将推出）"
    >
      <Bookmark class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>
