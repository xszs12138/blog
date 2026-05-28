/** 为标题生成锚点 id（支持中文） */
export function slugifyHeading(text: string, index: number, used: Set<string>): string {
  const normalized = text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]+/g, '')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  let id = normalized || `section-${index + 1}`
  let suffix = 2
  while (used.has(id)) {
    id = `${normalized || 'section'}-${suffix++}`
  }
  used.add(id)
  return id
}
