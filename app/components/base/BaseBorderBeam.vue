<script setup lang="ts">
import type { BorderBeamColor } from '~/utils/common/border-beam'
import { getBorderBeamGradient, getInsetOffset } from '~/utils/common/border-beam'
import { cn } from '~/utils/common/cn'

const props = withDefaults(defineProps<{
  /** 光束颜色或渐变色标 */
  color?: BorderBeamColor
  /** 动画时长（秒） */
  duration?: number
  /** 光束方块尺寸（px） */
  beamSize?: number
  /** 边框宽度，用于 mask 与 inset；不传则读取宿主 computed border */
  borderWidth?: number | string
  /** 圆角；不传则读取宿主 computed border-radius */
  borderRadius?: string
  /** 外扩距离，覆盖 borderWidth 计算的 inset */
  outset?: number | string
  /** always=常显；hover=悬停/聚焦时显示并播放 */
  trigger?: 'always' | 'hover'
  class?: string
  hostClass?: string
}>(), {
  duration: 6,
  beamSize: 100,
  trigger: 'hover',
})

const hostRef = ref<HTMLElement | null>(null)
const borderInfo = useBorderSize(hostRef)

const beamGradient = computed(() => getBorderBeamGradient(props.color))

const insetOffset = computed(() => {
  if (props.outset !== undefined) {
    return getInsetOffset(props.outset)
  }
  if (props.borderWidth !== undefined) {
    return getInsetOffset(props.borderWidth)
  }
  return borderInfo.value.borderWidth.map(getInsetOffset).join(' ')
})

const resolvedBorderRadius = computed(
  () => props.borderRadius ?? borderInfo.value.borderRadius ?? '0px',
)

const maskPadding = computed(() => {
  if (props.borderWidth !== undefined) {
    return typeof props.borderWidth === 'number'
      ? `${props.borderWidth}px`
      : props.borderWidth
  }
  const [top] = borderInfo.value.borderWidth
  return top > 0 ? `${top}px` : '1px'
})

const beamStyle = computed(() => ({
  '--border-beam-gradient': beamGradient.value,
  '--border-beam-inset': insetOffset.value,
  '--border-beam-radius': resolvedBorderRadius.value,
  '--border-beam-duration': `${props.duration}s`,
  '--border-beam-size': `${props.beamSize}px`,
  '--border-beam-mask-padding': maskPadding.value,
}))

const hostClasses = computed(() => cn(
  'border-beam-host relative',
  props.trigger === 'hover' && 'border-beam-host--hover',
  props.hostClass,
))
</script>

<template>
  <div ref="hostRef" :class="cn(hostClasses, props.class)">
    <div class="border-beam" :class="{ 'border-beam--always': trigger === 'always' }" :style="beamStyle"
      aria-hidden="true" />
    <slot />
  </div>
</template>

<style scoped>
.border-beam {
  display: none;
  position: absolute;
  inset: var(--border-beam-inset, 0);
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
  border-radius: var(--border-beam-radius, 0);
  padding: var(--border-beam-mask-padding, 1px);
  opacity: 0;
  transition: opacity 0.35s ease;
}

@supports ((mask-composite: exclude) or (-webkit-mask-composite: xor)) {
  .border-beam {
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
  }

  @supports (offset-path: rect(0 auto auto 0 round 1px)) {
    .border-beam {
      display: block;
    }

    .border-beam::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: var(--border-beam-size, 100px);
      aspect-ratio: 1 / 1;
      opacity: 0.95;
      background-image: var(--border-beam-gradient,
          linear-gradient(to left, rgb(136 192 150) 0%, rgb(210 255 218) 70%, transparent));
      offset-anchor: 90% 50%;
      offset-distance: 0%;
      offset-path: rect(0 auto auto 0 round var(--border-beam-radius, 16px));
      offset-rotate: auto;
      animation: border-beam-move var(--border-beam-duration, 6s) linear infinite;
      animation-play-state: paused;
      will-change: offset-distance;
    }
  }
}

.border-beam--always,
.border-beam-host--hover:hover .border-beam,
.border-beam-host--hover:focus-within .border-beam {
  opacity: 1;
}

.border-beam--always::before,
.border-beam-host--hover:hover .border-beam::before,
.border-beam-host--hover:focus-within .border-beam::before {
  animation-play-state: running;
}

@keyframes border-beam-move {
  from {
    offset-distance: 0%;
  }

  to {
    offset-distance: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .border-beam::before {
    animation: none;
    display: none;
  }
}

/* offset-path 不支持时，回退到 conic 旋转流光 */
@supports not (offset-path: rect(0 auto auto 0 round 1px)) {
  .border-beam {
    display: block;
    padding: 0;
    -webkit-mask: none;
    mask: none;
  }

  .border-beam::before {
    top: 50%;
    left: 50%;
    width: 160%;
    height: 160%;
    aspect-ratio: auto;
    transform: translate(-50%, -50%);
    background: conic-gradient(from 0deg,
        transparent 0deg,
        rgb(136 192 150 / 15%) 40deg,
        rgb(136 192 150 / 95%) 100deg,
        rgb(200 255 210) 140deg,
        rgb(136 192 150 / 95%) 180deg,
        transparent 260deg,
        transparent 360deg);
    offset-path: none;
    offset-distance: unset;
    offset-rotate: unset;
    offset-anchor: unset;
    animation: border-beam-spin var(--border-beam-duration, 6s) linear infinite;
    animation-play-state: paused;
  }

  .border-beam--always::before,
  .border-beam-host--hover:hover .border-beam::before,
  .border-beam-host--hover:focus-within .border-beam::before {
    animation-name: border-beam-spin;
  }
}

@keyframes border-beam-spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
