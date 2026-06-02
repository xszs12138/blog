<script lang="ts" setup>
import { ChevronDown } from '@lucide/vue'
import BaseLayout from '~/components/Layout/BaseLayout.vue'
import {
  buildArchiveTimelineSections,
  countArchiveEntries,
} from '~/utils/archive/build-archive-timeline'

definePageMeta({
  layout: 'default',
})

const PAGE_SIZE = 8

const { getArchives } = useArchivesApi()

const { data: archives, status } = await useAsyncData(
  'web-archives',
  async () => {
    try {
      return await getArchives()
    }
    catch {
      return []
    }
  },
)

const visibleLimit = ref(PAGE_SIZE)

const totalEntries = computed(() => countArchiveEntries(archives.value ?? []))

const sections = computed(() =>
  buildArchiveTimelineSections(archives.value ?? [], visibleLimit.value),
)

const hasMore = computed(() => visibleLimit.value < totalEntries.value)

function loadMore() {
  visibleLimit.value = Math.min(
    visibleLimit.value + PAGE_SIZE,
    totalEntries.value,
  )
}

useHead({
  title: '归档 | xsZs Blog',
})
</script>

<template>
  <BaseLayout mode="detail">
    <template #content>
      <BaseCard class="overflow-hidden p-0 shadow-md dark:shadow-black/30">
        <div class="border-b border-border px-5 py-6 md:px-8 md:py-7">
          <h1 class="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            归档
          </h1>
          <p class="mt-1.5 text-sm text-muted-foreground">
            按时间浏览已发布文章
          </p>
        </div>

        <div class="px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <div v-if="status === 'pending'" class="space-y-4" aria-busy="true">
            <div
              v-for="i in 3"
              :key="i"
              class="h-28 animate-pulse rounded-xl bg-muted/20"
            />
          </div>

          <template v-else-if="sections.length">
            <ArchiveTimeline :sections="sections" />

            <div v-if="hasMore" class="mt-10 flex justify-center">
              <button
                type="button"
                class="archive-load-more"
                @click="loadMore"
              >
                加载更多
                <ChevronDown class="size-4" aria-hidden="true" />
              </button>
            </div>
          </template>

          <BaseEmptyState
            v-else
            title="暂无归档"
            description="还没有已发布的文章。"
          />
        </div>
      </BaseCard>
    </template>
  </BaseLayout>
</template>
