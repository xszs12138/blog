export type ActivityType = 'post' | 'music' | 'game'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  subtitle?: string
  timeLabel: string
}
