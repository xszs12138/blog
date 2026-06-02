export type ArchiveEntryType = 'post'

export interface ArchiveTimelineEntry {
  id: string
  type: ArchiveEntryType
  title: string
  description: string
  cover?: string
  date: string
  viewCount?: number
  href: string
}

export type ArchiveTimelineSection =
  | { kind: 'year', year: number }
  | {
    kind: 'month'
    year: number
    month: number
    entries: ArchiveTimelineEntry[]
  }
