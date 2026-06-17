import type { Component } from 'vue'

import {
  Archive,
  Gamepad2,
  Images,
  List,
  User,
} from '@lucide/vue'

export interface NavItem {
  label: string
  to: string
  icon: Component
  match: (path: string) => boolean
}

export const navItems: NavItem[] = [
  {
    label: '文章',
    to: '/post',
    icon: List,
    match: path => path.startsWith('/post'),
  },
  {
    label: '归档',
    to: '/archive',
    icon: Archive,
    match: path => path.startsWith('/archive'),
  },
  {
    label: '相册',
    to: '/albums',
    icon: Images,
    match: path => path.startsWith('/albums') || path.startsWith('/alums'),
  },
  {
    label: '游戏',
    to: '/games',
    icon: Gamepad2,
    match: path => path.startsWith('/games'),
  },
  {
    label: '关于',
    to: '/about',
    icon: User,
    match: path => path.startsWith('/about'),
  },
]
