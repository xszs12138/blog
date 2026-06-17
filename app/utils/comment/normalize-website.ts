/** 补全网站协议，便于通过服务端 url 校验 */
export function normalizeWebsite(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}
