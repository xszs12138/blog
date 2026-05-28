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

const pageDescription = computed(() => {
  if (categorySlug.value) {
    return '该分类下的已发布文章'
  }
  if (tagSlug.value) {
    return '该标签下的已发布文章'
  }
  if (keyword.value) {
    return '匹配标题或摘要的文章'
  }
  return '浏览站点全部已发布文章'
})

const hasFilter = computed(
  () => Boolean(categorySlug.value || tagSlug.value || keyword.value),
)

function clearFilters() {
  navigateTo({ path: route.path })
}

useHead(() => ({
  title: `${pageTitle.value} | xsZs Blog`,
}))
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
    <header class="mb-8">
      <NuxtLink
        to="/home"
        class="mb-4 inline-flex text-sm text-muted-foreground transition-colors hover:text-accent"
      >
        ← 返回首页
      </NuxtLink>

      <h1 class="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {{ pageTitle }}
      </h1>
      <p class="mt-2 text-sm text-muted-foreground">
        {{ pageDescription }}
      </p>

      <button
        v-if="hasFilter"
        type="button"
        class="mt-4 inline-flex items-center rounded-full border border-border bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent/30 hover:text-foreground"
        @click="clearFilters"
      >
        清除筛选
      </button>
    </header>

    <PostList
      :page-size="POST_LIST_PAGE_SIZE"
      list-key-prefix="post-archive"
      :scroll-to-posts-anchor="false"
      empty-title="暂无文章"
      :empty-description="hasFilter ? '当前筛选条件下没有文章。' : '发布第一篇文章后，会显示在这里。'"
    />
  </main>
</template>
