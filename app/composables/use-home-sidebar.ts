import type { CategoryItem } from '~/types/category'
import type { TagItem } from '~/types/tag'

export async function fetchHomeSidebar() {
  const { getCategories } = useCategoriesApi()
  const { getTags } = useTagsApi()

  const [categoriesResult, tagsResult] = await Promise.allSettled([
    getCategories(),
    getTags(),
  ])

  return {
    categories: categoriesResult.status === 'fulfilled'
      ? categoriesResult.value
      : [] as CategoryItem[],
    tags: tagsResult.status === 'fulfilled'
      ? tagsResult.value
      : [] as TagItem[],
  }
}

export function useHomeSidebar() {
  return useAsyncData('home-sidebar', fetchHomeSidebar)
}
