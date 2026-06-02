export type BorderWidth = readonly [number, number, number, number]

export interface BorderInfo {
  borderWidth: BorderWidth
  borderRadius: string
}

const DEFAULT_BORDER_INFO: BorderInfo = {
  borderWidth: [0, 0, 0, 0],
  borderRadius: '0px',
}

function parseBorderWidth(value: string): number {
  const size = Number.parseFloat(value)
  return Number.isFinite(size) ? size : 0
}

export function useBorderSize(domNode: Ref<HTMLElement | null | undefined>) {
  const borderInfo = shallowRef<BorderInfo>(DEFAULT_BORDER_INFO)

  function measure() {
    const node = domNode.value
    if (!node) {
      borderInfo.value = DEFAULT_BORDER_INFO
      return
    }

    const {
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderRadius,
    } = getComputedStyle(node)

    borderInfo.value = {
      borderWidth: [
        parseBorderWidth(borderTopWidth),
        parseBorderWidth(borderRightWidth),
        parseBorderWidth(borderBottomWidth),
        parseBorderWidth(borderLeftWidth),
      ],
      borderRadius,
    }
  }

  watch(domNode, () => {
    measure()
  }, { immediate: true, flush: 'post' })

  onMounted(() => {
    measure()
  })

  let resizeObserver: ResizeObserver | null = null

  watch(domNode, (node, _, onCleanup) => {
    resizeObserver?.disconnect()
    resizeObserver = null
    if (!node || typeof ResizeObserver === 'undefined') {
      return
    }
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(node)
    onCleanup(() => resizeObserver?.disconnect())
  }, { flush: 'post' })

  return borderInfo
}
