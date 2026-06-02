import type { DLive2dOptions } from 'wl-live2d'

/**
 * wl-live2d 默认配置
 * @see https://live2d.doc.nianian.cn/
 */
export const defaultLive2dOptions: DLive2dOptions = {
  sayHello: false,
  /** 须为 true，false 时库会向 classList 写入空字符串导致报错；位置由 CSS 固定在右下 */
  dockedRight: true,
  fixed: true,
  drag: true,
  transitionTime: 500,
  homePath: '/home',
  menus: [],
  models: [
    {
      name: 'hijiki',
      path: 'https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-hijiki/assets/hijiki.model.json',
      position: { x: 0, y: 0 },
      scale: 0.52,
      mobileScale: 0.42,
      motionPreload: 'IDLE',
    },
  ],
  tips: {
    drag: false,
    talk: false,
    motionMessage: false,
    message: [],
  },
}
