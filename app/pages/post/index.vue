<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const POST_LIST_PAGE_SIZE = 10

const route = useRoute()

const categorySlug = computed(() => {
  const value = route.query.categorySlug
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
})
const tagSlug = computed(() => {
  const value = route.query.tagSlug
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
})
const keyword = computed(() => {
  const value = route.query.keyword
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
})

const { getCategories } = useCategoriesApi()
const { getTags } = useTagsApi()

const filterMetaKey = computed(
  () => `post-filter-meta-${categorySlug.value ?? ''}-${tagSlug.value ?? ''}`,
)

const { data: filterMeta } = await useAsyncData(
  () => filterMetaKey.value,
  async () => {
    const slug = categorySlug.value ?? tagSlug.value
    if (!slug) {
      return { categoryName: null as string | null, tagName: null as string | null }
    }

    const [categoriesResult, tagsResult] = await Promise.allSettled([
      categorySlug.value ? getCategories() : Promise.resolve([]),
      tagSlug.value ? getTags() : Promise.resolve([]),
    ])

    const categoryName
      = categoriesResult.status === 'fulfilled'
        ? categoriesResult.value.find(item => item.slug === categorySlug.value)?.name ?? null
        : null

    const tagName
      = tagsResult.status === 'fulfilled'
        ? tagsResult.value.find(item => item.slug === tagSlug.value)?.name ?? null
        : null

    return { categoryName, tagName }
  },
  { watch: [categorySlug, tagSlug] },
)

const pageTitle = computed(() => {
  if (categorySlug.value) {
    return filterMeta.value?.categoryName ?? categorySlug.value
  }
  if (tagSlug.value) {
    return filterMeta.value?.tagName ?? tagSlug.value
  }
  if (keyword.value) {
    return `搜索：${keyword.value}`
  }
  return '全部文章'
})

const hasFilter = computed(
  () => Boolean(categorySlug.value || tagSlug.value || keyword.value),
)

useHead(() => ({
  title: `${pageTitle.value} | xsZs Blog`,
}))
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
    <PostList
      :page-size="POST_LIST_PAGE_SIZE"
      list-key-prefix="post-archive"
      :scroll-to-posts-anchor="false"
      empty-title="暂无文章"
      :empty-description="
        keyword
          ? `没有找到与「${keyword}」相关的文章，试试其他关键词。`
          : hasFilter
            ? '当前筛选条件下没有文章。'
            : '发布第一篇文章后，会显示在这里。'
      "
    />
  </main>
</template>
