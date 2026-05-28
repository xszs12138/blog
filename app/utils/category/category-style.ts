import type { ClassValue } from 'clsx'
import { cn } from '~/utils/common/cn'

export interface CategoryTone {
  badge: ClassValue
  icon: ClassValue
}

const TONE_BY_SLUG: Record<string, CategoryTone> = {
  game: {
    badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/25',
    icon: 'text-emerald-400',
  },
  games: {
    badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/25',
    icon: 'text-emerald-400',
  },
  tech: {
    badge: 'bg-violet-500/15 text-violet-300 ring-violet-400/25',
    icon: 'text-violet-400',
  },
  life: {
    badge: 'bg-sky-500/15 text-sky-300 ring-sky-400/25',
    icon: 'text-sky-400',
  },
  note: {
    badge: 'bg-amber-500/15 text-amber-300 ring-amber-400/25',
    icon: 'text-amber-400',
  },
  music: {
    badge: 'bg-pink-500/15 text-pink-300 ring-pink-400/25',
    icon: 'text-pink-400',
  },
}

const DEFAULT_TONE: CategoryTone = {
  badge: 'bg-white/10 text-foreground/90 ring-white/15',
  icon: 'text-muted-foreground',
}

const NAME_TO_SLUG: Record<string, string> = {
  游戏: 'game',
  技术: 'tech',
  生活: 'life',
  随笔: 'note',
  音乐: 'music',
}

function resolveCategoryKey(slug?: string, name?: string): string {
  const slugKey = slug?.trim().toLowerCase() ?? ''
  if (slugKey && TONE_BY_SLUG[slugKey]) {
    return slugKey
  }
  const mapped = name ? NAME_TO_SLUG[name.trim()] : undefined
  if (mapped) {
    return mapped
  }
  return slugKey
}

export function getCategoryTone(slug?: string, name?: string): CategoryTone {
  const key = resolveCategoryKey(slug, name)
  if (!key) {
    return DEFAULT_TONE
  }
  return TONE_BY_SLUG[key] ?? DEFAULT_TONE
}

export function categoryBadgeClass(slug?: string, name?: string): string {
  const tone = getCategoryTone(slug, name)
  return cn(
    'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset backdrop-blur-sm',
    tone.badge,
  )
}
