<script setup lang="ts">
import { Calendar } from '@lucide/vue'
import { formatPostDate } from '~/utils/common/format-post-date'
import { cn } from '~/utils/common/cn'

const props = withDefaults(
  defineProps<{
    to: string
    title: string
    cover?: string
    publishedAt?: string
    label?: string
    align?: 'center' | 'left' | 'right'
    minHeight?: string
  }>(),
  {
    align: 'center',
    minHeight: '7.5rem',
  },
)

const dateLabel = computed(() => formatPostDate(props.publishedAt))
</script>

<template>
  <NuxtLink
    :to="to"
    class="post-cover-card group relative block w-full overflow-hidden rounded-xl outline-none transition-transform duration-300 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-accent/50"
    :style="{ minHeight }"
  >
    <img
      v-if="cover?.trim()"
      :src="cover"
      alt=""
      class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
      decoding="async"
    >
    <div
      v-else
      class="absolute inset-0 bg-linear-to-br from-accent/35 via-violet-600/25 to-slate-900/80"
      aria-hidden="true"
    />

    <div
      class="absolute inset-0 bg-linear-to-t from-black/75 via-black/45 to-black/20"
      aria-hidden="true"
    />

    <div
      :class="cn(
        'relative z-1 flex w-full flex-col justify-center gap-1.5 p-4 text-white sm:p-5',
        align === 'left' && 'items-start text-left',
        align === 'right' && 'items-end text-right',
        align === 'center' && 'items-center text-center',
      )"
    >
      <span v-if="label" class="text-xs font-medium text-white/75">
        {{ label }}
      </span>
      <span
        v-if="dateLabel && !label"
        class="inline-flex items-center gap-1.5 text-xs text-white/80"
      >
        <Calendar class="size-3.5 shrink-0" aria-hidden="true" />
        {{ dateLabel }}
      </span>
      <span class="line-clamp-2 text-base font-semibold leading-snug sm:text-lg">
        {{ title }}
      </span>
    </div>
  </NuxtLink>
</template>
