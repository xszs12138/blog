import type { ActivityItem } from '~/types/activity'
import type { PostListItem } from '~/types/post'
import { formatRelativeTime } from '~/utils/common/format-relative-time'

const FALLBACK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'fallback-game',
    type: 'game',
    title: '正在玩',
    subtitle: '空之轨迹 the 1st',
    timeLabel: '2 小时前',
  },
  {
    id: 'fallback-music',
    type: 'music',
    title: '正在听',
    subtitle: 'Inevitable Struggle',
    timeLabel: '昨天 23:14',
  },
]

function activitiesFromPosts(posts: PostListItem[]): ActivityItem[] {
  return posts.slice(0, 3).map(post => ({
    id: `post-${post.id}`,
    type: 'post' as const,
    title: '发布了新文章',
    subtitle: post.title,
    timeLabel: formatRelativeTime(post.publishedAt) || '最近',
  }))
}

export function buildHomeActivities(posts: PostListItem[]): ActivityItem[] {
  const fromPosts = activitiesFromPosts(posts)
  if (fromPosts.length >= 2) {
    return fromPosts
  }
  return [...fromPosts, ...FALLBACK_ACTIVITIES].slice(0, 4)
}
