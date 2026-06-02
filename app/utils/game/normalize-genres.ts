/** API 可能返回 null，统一为字符串数组 */
export function normalizeGenres(genres: string[] | null | undefined): string[] {
  return Array.isArray(genres) ? genres : []
}
