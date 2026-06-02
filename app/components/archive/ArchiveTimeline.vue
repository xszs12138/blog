<script setup lang="ts">
import type { ArchiveTimelineSection } from '~/types/archive-timeline'

defineProps<{
  sections: ArchiveTimelineSection[]
}>()

function formatMonth(month: number) {
  return `${month}月`
}
</script>

<template>
  <div class="archive-timeline relative">
    <div class="archive-timeline__line" aria-hidden="true" />

    <template v-for="(section, index) in sections" :key="`${section.kind}-${index}`">
      <div v-if="section.kind === 'year'" class="archive-year">
        <span class="archive-timeline__dot archive-timeline__dot--year" aria-hidden="true" />
        <h2 class="archive-year__label">
          {{ section.year }}
        </h2>
      </div>

      <div v-else class="archive-month">
        <span class="archive-timeline__dot archive-timeline__dot--month" aria-hidden="true" />
        <div class="archive-month__label">
          {{ formatMonth(section.month) }}
        </div>
        <div class="archive-month__body">
          <ul class="archive-month__list">
            <li v-for="entry in section.entries" :key="entry.id">
              <ArchiveEntryCard :entry="entry" />
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
