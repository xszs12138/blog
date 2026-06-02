import type { wlLive2d } from 'wl-live2d'

type Live2dInstance = ReturnType<typeof wlLive2d>

const live2dInstance = shallowRef<Live2dInstance | null>(null)

/** 获取 wl-live2d 实例（挂载完成后可用） */
export function useLive2d() {
  return readonly(live2dInstance)
}

export function setLive2dInstance(instance: Live2dInstance | null) {
  live2dInstance.value = instance
}
