/**
 * 根据滚动方向控制顶栏显隐：靠近顶部始终显示，向下隐藏、向上显示。
 */
export function useHeaderScroll(options?: {
  /** 距顶部小于该值时始终显示（px） */
  topOffset?: number
  /** 忽略小于该值的滚动变化，减少抖动（px） */
  minDelta?: number
}) {
  const topOffset = options?.topOffset ?? 72
  const minDelta = options?.minDelta ?? 8

  const isHeaderVisible = ref(true)
  const { y: scrollY } = useWindowScroll()

  let lastScrollY = 0

  onMounted(() => {
    lastScrollY = scrollY.value
  })

  const route = useRoute()
  watch(() => route.fullPath, () => {
    isHeaderVisible.value = true
    lastScrollY = scrollY.value
  })

  watch(scrollY, (currentY) => {
    const current = currentY ?? 0

    if (current <= topOffset) {
      isHeaderVisible.value = true
      lastScrollY = current
      return
    }

    const delta = current - lastScrollY
    if (Math.abs(delta) < minDelta) {
      return
    }

    isHeaderVisible.value = delta < 0
    lastScrollY = current
  })

  return { isHeaderVisible }
}
