<script setup lang="ts">
import { Calendar } from '@lucide/vue'
import { cn } from '~/utils/common/cn'
import { formatPostDate } from '~/utils/common/format-post-date'

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
const hasCover = computed(() => Boolean(props.cover?.trim()))
</script>

<template>
  <NuxtLink :to="to" :class="cn(
    'post-cover-card group relative block w-full overflow-hidden rounded-xl outline-none transition-all duration-300 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-accent/50',
    !hasCover && 'border border-border bg-blog-card hover:border-accent/25',
  )" :style="{ minHeight }">
    <img v-if="hasCover" :src="cover" alt=""
      class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy" decoding="async">

    <div v-if="hasCover" class="absolute inset-0 bg-linear-to-t from-black/75 via-black/45 to-black/20"
      aria-hidden="true" />

    <div :class="cn(
      'relative z-1 flex w-full flex-col justify-center gap-1.5 p-4 sm:p-5',
      hasCover ? 'text-white' : 'text-foreground',
      align === 'left' && 'items-start text-left',
      align === 'right' && 'items-end text-right',
      align === 'center' && 'items-center text-center',
    )">
      <span v-if="label" :class="cn(
        'text-xs font-medium',
        hasCover ? 'text-white/75' : 'text-muted-foreground',
      )">
        {{ label }}
      </span>
      <span v-if="dateLabel && !label" :class="cn(
        'inline-flex items-center gap-1.5 text-xs',
        hasCover ? 'text-white/80' : 'text-muted-foreground',
      )">
        <Calendar class="size-3.5 shrink-0" aria-hidden="true" />
        {{ dateLabel }}
      </span>
      <span class="line-clamp-2 text-base font-semibold leading-snug sm:text-lg">
        {{ title }}
      </span>
    </div>
  </NuxtLink>
</template>
