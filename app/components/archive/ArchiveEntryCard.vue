<script setup lang="ts">
import type { ArchiveTimelineEntry } from '~/types/archive-timeline'
import { Calendar, Eye } from '@lucide/vue'
import { formatPostDate } from '~/utils/common/format-post-date'
import { formatViewCount } from '~/utils/common/format-view-count'

const props = defineProps<{
  entry: ArchiveTimelineEntry
}>()

const typeMeta = {
  post: { label: '文章' },
} as const

const meta = computed(() => typeMeta[props.entry.type])
const dateLabel = computed(() => formatPostDate(props.entry.date))
const viewsLabel = computed(() =>
  props.entry.viewCount != null
    ? formatViewCount(props.entry.viewCount)
    : '',
)
</script>

<template>
  <NuxtLink :to="entry.href" class="archive-entry-card group">
    <div class="archive-entry-card__content">
      <div class="archive-entry-card__head">
        <span class="archive-entry-card__badge">
          {{ meta.label }}
        </span>
        <h3 class="archive-entry-card__title">
          {{ entry.title }}
        </h3>
      </div>

      <p class="archive-entry-card__summary">
        {{ entry.description }}
      </p>

      <div class="archive-entry-card__meta">
        <span v-if="dateLabel" class="archive-entry-card__meta-item">
          <Calendar class="size-3.5 shrink-0" aria-hidden="true" />
          {{ dateLabel }}
        </span>
        <span v-if="viewsLabel" class="archive-entry-card__meta-item">
          <Eye class="size-3.5 shrink-0" aria-hidden="true" />
          {{ viewsLabel }}
        </span>
      </div>
    </div>

    <div class="archive-entry-card__thumb">
      <img
        v-if="entry.cover"
        :src="entry.cover"
        :alt="`${entry.title} 封面`"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        decoding="async"
      >
      <div
        v-else
        class="archive-entry-card__thumb-fallback"
        aria-hidden="true"
      >
        无封面
      </div>
    </div>
  </NuxtLink>
</template>
