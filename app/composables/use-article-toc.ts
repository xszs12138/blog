import type { TocItem } from '~/types/toc'

function sameIdList(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  return a.every((id, index) => id === b[index])
}

/** 正文滚动：收集视口内标题 id，供目录分组背景 */
export function useArticleToc(
  articleRef: Ref<HTMLElement | null>,
  toc: Ref<TocItem[]>,
) {
  const visibleIds = ref<string[]>([])
  const activeId = ref('')

  watch(
    toc,
    (items) => {
      if (items.length && !activeId.value) {
        activeId.value = items[0]!.id
      }
    },
    { immediate: true },
  )

  function updateVisibleHeadings() {
    const root = articleRef.value
    if (!root) {
      return
    }

    const headings = Array.from(
      root.querySelectorAll<HTMLElement>('h2[id], h3[id]'),
    )
    if (!headings.length) {
      if (visibleIds.value.length) {
        visibleIds.value = []
      }
      return
    }

    const offset = 120
    const viewportBottom = window.innerHeight

    const visible = headings.filter((el) => {
      const rect = el.getBoundingClientRect()
      return rect.top < viewportBottom && rect.bottom > offset
    })

    const nextVisibleIds = visible.map(el => el.id)
    if (!sameIdList(visibleIds.value, nextVisibleIds)) {
      visibleIds.value = nextVisibleIds
    }

    const nextActive = visible.length > 0
      ? visible[visible.length - 1]!.id
      : (() => {
          let current = headings[0]!.id
          for (const el of headings) {
            if (el.getBoundingClientRect().top <= offset) {
              current = el.id
            }
          }
          return current
        })()

    if (activeId.value !== nextActive) {
      activeId.value = nextActive
    }
  }

  let rafId = 0

  function onScroll() {
    if (rafId) {
      return
    }
    rafId = requestAnimationFrame(() => {
      rafId = 0
      updateVisibleHeadings()
    })
  }

  onMounted(() => {
    nextTick(updateVisibleHeadings)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    watch(articleRef, () => nextTick(updateVisibleHeadings))
    watch(toc, () => nextTick(updateVisibleHeadings))
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  })

  function scrollToHeading(id: string) {
    activeId.value = id
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return {
    visibleIds,
    activeId,
    scrollToHeading,
  }
}
