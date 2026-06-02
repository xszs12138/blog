import type { ArchiveYear } from '~/types/archive'
import type { ArchiveTimelineEntry, ArchiveTimelineSection } from '~/types/archive-timeline'

export function countArchiveEntries(years: ArchiveYear[]): number {
  return years.reduce(
    (sum, year) =>
      sum + year.months.reduce((mSum, month) => mSum + month.posts.length, 0),
    0,
  )
}

function mapPostToEntry(post: ArchiveYear['months'][number]['posts'][number]): ArchiveTimelineEntry {
  return {
    id: `post-${post.id}`,
    type: 'post',
    title: post.title,
    description: post.summary?.trim() || '暂无摘要',
    cover: post.cover?.trim() || undefined,
    date: post.publishedAt,
    viewCount: post.viewCount,
    href: `/post/${post.slug}`,
  }
}

/** 将归档 API 数据转为时间轴区块（受 limit 截断，用于「加载更多」） */
export function buildArchiveTimelineSections(
  years: ArchiveYear[],
  limit: number,
): ArchiveTimelineSection[] {
  const sections: ArchiveTimelineSection[] = []
  let shown = 0

  for (const yearBlock of years) {
    let yearHeaderAdded = false

    for (const monthBlock of yearBlock.months) {
      const entries: ArchiveTimelineEntry[] = []

      for (const post of monthBlock.posts) {
        if (shown >= limit) {
          if (entries.length) {
            if (!yearHeaderAdded) {
              sections.push({ kind: 'year', year: yearBlock.year })
              yearHeaderAdded = true
            }
            sections.push({
              kind: 'month',
              year: yearBlock.year,
              month: monthBlock.month,
              entries: [...entries],
            })
          }
          return sections
        }

        entries.push(mapPostToEntry(post))
        shown++
      }

      if (entries.length) {
        if (!yearHeaderAdded) {
          sections.push({ kind: 'year', year: yearBlock.year })
          yearHeaderAdded = true
        }
        sections.push({
          kind: 'month',
          year: yearBlock.year,
          month: monthBlock.month,
          entries,
        })
      }
    }
  }

  return sections
}
