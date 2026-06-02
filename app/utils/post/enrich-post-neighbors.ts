import type { PostDetail, PostListItem, PostNeighbor } from '~/types/post'

async function patchNeighborCover(
  neighbor: PostNeighbor | undefined,
  getBySlug: (slug: string) => Promise<PostDetail>,
  related?: PostListItem[],
): Promise<PostNeighbor | undefined> {
  if (!neighbor) {
    return undefined
  }
  if (neighbor.cover?.trim()) {
    return neighbor
  }

  const fromRelated = related?.find(item => item.slug === neighbor.slug)
  if (fromRelated?.cover?.trim()) {
    return {
      ...neighbor,
      cover: fromRelated.cover,
      publishedAt: neighbor.publishedAt ?? fromRelated.publishedAt,
    }
  }

  try {
    const full = await getBySlug(neighbor.slug)
    if (full.cover?.trim()) {
      return {
        ...neighbor,
        cover: full.cover,
        publishedAt: neighbor.publishedAt ?? full.publishedAt,
      }
    }
  }
  catch {
    // 忽略单篇拉取失败
  }

  return neighbor
}

/** 为上一篇/下一篇补全封面（列表、详情接口兜底） */
export async function enrichNeighborCovers(
  post: PostDetail,
  getBySlug: (slug: string) => Promise<PostDetail>,
  related?: PostListItem[],
): Promise<PostDetail> {
  const [prevPost, nextPost] = await Promise.all([
    patchNeighborCover(post.prevPost, getBySlug, related),
    patchNeighborCover(post.nextPost, getBySlug, related),
  ])

  return {
    ...post,
    prevPost,
    nextPost,
  }
}
