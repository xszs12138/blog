import type { SiteInfo } from '~/types/site'

export interface HomeProfileStats {
  postCount: number
  categoryCount: number
  tagCount: number
}

export interface HomeProfileData {
  site: SiteInfo | null
  stats: HomeProfileStats
}

export async function fetchHomeProfile(): Promise<HomeProfileData> {
  const { getSite } = useSiteApi()
  const { getPosts } = usePostsApi()
  const { getCategories } = useCategoriesApi()
  const { getTags } = useTagsApi()

  const [siteResult, postsResult, categoriesResult, tagsResult] = await Promise.allSettled([
    getSite(),
    getPosts({ page: 1, pageSize: 1 }),
    getCategories(),
    getTags(),
  ])

  return {
    site: siteResult.status === 'fulfilled' ? siteResult.value : null,
    stats: {
      postCount: postsResult.status === 'fulfilled' ? postsResult.value.total : 0,
      categoryCount: categoriesResult.status === 'fulfilled' ? categoriesResult.value.length : 0,
      tagCount: tagsResult.status === 'fulfilled' ? tagsResult.value.length : 0,
    },
  }
}

export function useHomeProfile() {
  return useAsyncData('home-profile', fetchHomeProfile)
}
