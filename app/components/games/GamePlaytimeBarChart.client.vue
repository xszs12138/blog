<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import type { GamePlaytimeMonth } from '~/types/game'
import { useResizeObserver } from '@vueuse/core'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

import { formatMonthLabel } from '~/utils/game/format-month-label'
import { formatPlaytimeHours } from '~/utils/game/format-playtime-hours'

const props = defineProps<{
  months: GamePlaytimeMonth[]
}>()

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const isDark = useThemeDark()

function cssVar(name: string, fallback: string) {
  if (!import.meta.client) {
    return fallback
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

function buildOption(): EChartsOption {
  const accent = cssVar('--blog-accent', '#76b876')
  const muted = cssVar('--blog-muted', '#5f6f7a')
  const fg = cssVar('--blog-fg', '#2c3e50')
  const border = cssVar('--blog-border', 'rgb(76 130 88 / 16%)')
  const cardBg = cssVar('--blog-card-bg', '#ffffff')

  return {
    animationDuration: 480,
    grid: {
      left: 0,
      right: 0,
      top: 8,
      bottom: 0,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: cardBg,
      borderColor: border,
      textStyle: { color: fg, fontSize: 12 },
      formatter(params) {
        const item = Array.isArray(params) ? params[0] : params
        if (!item || item.dataIndex == null) {
          return ''
        }
        const month = props.months[item.dataIndex]
        if (!month) {
          return ''
        }
        return `${formatMonthLabel(month.month)} · ${formatPlaytimeHours(month.hours)}`
      },
    },
    xAxis: {
      type: 'category',
      data: props.months.map(item => formatMonthLabel(item.month)),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: muted,
        fontSize: 11,
        margin: 10,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        type: 'bar',
        data: props.months.map(item => item.hours),
        barMaxWidth: 28,
        itemStyle: {
          color: accent,
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            opacity: 0.85,
          },
        },
      },
    ],
  }
}

function renderChart() {
  if (!chartRef.value) {
    return
  }
  if (!chart) {
    chart = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
  }
  chart.setOption(buildOption(), true)
}

watch(
  () => props.months,
  () => nextTick(renderChart),
  { deep: true },
)

watch(isDark, () => nextTick(renderChart))

onMounted(() => {
  nextTick(renderChart)
})

useResizeObserver(chartRef, () => {
  chart?.resize()
})

onBeforeUnmount(() => {
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div ref="chartRef" class="game-playtime-chart h-24 w-full min-w-0" role="img"
    :aria-label="`近 ${months.length} 个月游戏时长柱状图`" />
</template>
