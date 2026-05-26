import type { CategoryItem } from '~/types/category'

export function useCategoriesApi() {
  const api = useApiClient()

  return {
    getCategories: () => api<CategoryItem[]>('/web/categories'),
  }
}
