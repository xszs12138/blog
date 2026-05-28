import type { PageResult } from '~/types/api'
import type { PostListItem } from '~/types/post'

export interface UsePostsListOptions {
  pageSize?: number
  /** useAsyncData 缓存键前缀，不同列表页需区分 */
  keyPrefix?: string
  /** 翻页后滚到 #posts；否则滚到页面顶部 */
  scrollToPostsAnchor?: boolean
}

function queryParam(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export async function usePostsList(options: UsePostsListOptions = {}) {
  const pageSize = options.pageSize ?? 10
  const keyPrefix = options.keyPrefix ?? 'posts'
  const scrollToPostsAnchor = options.scrollToPostsAnchor ?? false

  const route = useRoute()
  const router = useRouter()
  const { getPosts } = usePostsApi()

  const categorySlug = computed(() => queryParam(route.query.categorySlug))
  const tagSlug = computed(() => queryParam(route.query.tagSlug))
  const keyword = computed(() => queryParam(route.query.keyword))

  const page = computed({
    get: () => {
      const raw = Number(route.query.page)
      return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1
    },
    set: (value: number) => {
      const next = Math.max(1, value)
      const query = { ...route.query }
      if (next === 1) {
        delete query.page
      }
      else {
        query.page = String(next)
      }
      router.push({ path: route.path, query })
    },
  })

  const listKey = computed(
    () =>
      `${keyPrefix}-${page.value}-${categorySlug.value ?? ''}-${tagSlug.value ?? ''}-${keyword.value ?? ''}-${pageSize}`,
  )

  const { data, status, refresh } = await useAsyncData(
    () => listKey.value,
    async () => {
      try {
        return await getPosts({
          page: page.value,
          pageSize,
          categorySlug: categorySlug.value,
          tagSlug: tagSlug.value,
          keyword: keyword.value,
        })
      }
      catch {
        return { items: [], total: 0 } satisfies PageResult<PostListItem>
      }
    },
    { watch: [page, categorySlug, tagSlug, keyword] },
  )

  const posts = computed(() => data.value?.items ?? [])
  const total = computed(() => data.value?.total ?? 0)
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / pageSize)),
  )

  if (import.meta.client) {
    watch(page, () => {
      nextTick(() => {
        if (scrollToPostsAnchor) {
          document.getElementById('posts')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
        else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      })
    })
  }

  return {
    page,
    posts,
    total,
    totalPages,
    status,
    refresh,
    categorySlug,
    tagSlug,
    keyword,
    pageSize,
  }
}
