import type { Component } from 'vue'
import {
  Code2,
  Coffee,
  Folder,
  Gamepad2,
  Headphones,
  MessageCircle,
  Music,
  PenLine,
} from '@lucide/vue'

const ICON_BY_SLUG: Record<string, Component> = {
  game: Gamepad2,
  games: Gamepad2,
  tech: Code2,
  life: Coffee,
  note: PenLine,
  notes: PenLine,
  music: Music,
  chat: MessageCircle,
  discord: MessageCircle,
}

const NAME_TO_SLUG: Record<string, string> = {
  游戏: 'game',
  技术: 'tech',
  生活: 'life',
  随笔: 'note',
  音乐: 'music',
  闲聊: 'chat',
}

function resolveCategoryKey(slug?: string, name?: string): string {
  const slugKey = slug?.trim().toLowerCase() ?? ''
  if (slugKey && ICON_BY_SLUG[slugKey]) {
    return slugKey
  }
  const mapped = name ? NAME_TO_SLUG[name.trim()] : undefined
  if (mapped) {
    return mapped
  }
  return slugKey
}

export function getCategoryIcon(slug?: string, name?: string): Component {
  const key = resolveCategoryKey(slug, name)
  if (!key) {
    return Folder
  }
  return ICON_BY_SLUG[key] ?? Folder
}

export function getActivityIcon(type: 'post' | 'music' | 'game'): Component {
  if (type === 'music') {
    return Headphones
  }
  if (type === 'game') {
    return Gamepad2
  }
  return PenLine
}
