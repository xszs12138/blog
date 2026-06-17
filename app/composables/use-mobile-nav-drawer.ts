import { createSharedComposable, onKeyStroke } from '@vueuse/core'

function _useMobileNavDrawer() {
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
    onKeyStroke('Escape', (event) => {
      if (!isOpen.value) {
        return
      }
      event.preventDefault()
      close()
    })
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

export const useMobileNavDrawer = createSharedComposable(_useMobileNavDrawer)
