/**
 * 锁定页面滚动并补偿滚动条宽度，避免 overflow:hidden 导致布局横向跳动。
 */
export function lockBodyScroll(): () => void {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  const previous = {
    overflow: document.body.style.overflow,
    paddingRight: document.body.style.paddingRight,
  }

  const fixedEls: Array<{ el: HTMLElement, paddingRight: string }> = []

  document.body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`

    for (const el of document.querySelectorAll<HTMLElement>('.header-bar')) {
      fixedEls.push({ el, paddingRight: el.style.paddingRight })
      el.style.paddingRight = `${scrollbarWidth}px`
    }
  }

  return () => {
    document.body.style.overflow = previous.overflow
    document.body.style.paddingRight = previous.paddingRight
    for (const { el, paddingRight } of fixedEls) {
      el.style.paddingRight = paddingRight
    }
  }
}
