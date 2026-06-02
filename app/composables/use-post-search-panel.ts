import { createSharedComposable, onKeyStroke } from '@vueuse/core'

function _usePostSearchPanel() {
  const isOpen = ref(false)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  if (import.meta.client) {
    onKeyStroke('k', (event) => {
      if (!(event.metaKey || event.ctrlKey) || event.shiftKey || event.altKey) {
        return
      }

      const target = event.target
      if (
        target instanceof HTMLElement
        && (target.tagName === 'INPUT'
          || target.tagName === 'TEXTAREA'
          || target.isContentEditable)
      ) {
        return
      }

      event.preventDefault()
      toggle()
    })
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

export const usePostSearchPanel = createSharedComposable(_usePostSearchPanel)
