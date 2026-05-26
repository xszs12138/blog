<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { getPostBySlug } = usePostsApi()

const { data: post, status } = await useAsyncData(
  () => `web-post-${slug.value}`,
  async () => {
    try {
      return await getPostBySlug(slug.value)
    }
    catch {
      return null
    }
  },
  { watch: [slug] },
)

useHead(() => ({
  title: post.value?.title ? `${post.value.title} | xsZs Blog` : '文章详情',
}))
</script>

<template>
  <article class="mx-auto max-w-3xl px-4 py-24 md:px-6">
    <div v-if="status === 'pending'" class="animate-pulse space-y-4" aria-busy="true">
      <div class="h-8 w-2/3 rounded bg-muted/25" />
      <div class="h-4 w-full rounded bg-muted/20" />
      <div class="h-4 w-5/6 rounded bg-muted/20" />
    </div>

    <template v-else-if="post">
      <NuxtLink
        to="/home"
        class="mb-6 inline-flex text-sm text-muted-foreground transition-colors hover:text-accent"
      >
        ← 返回首页
      </NuxtLink>
      <h1 class="font-heading text-3xl font-bold text-foreground">
        {{ post.title }}
      </h1>
      <PostMetaRow
        class="mt-4"
        :published-at="post.publishedAt"
        :summary="post.summary"
        :view-count="post.viewCount"
      />
      <p class="mt-8 text-muted-foreground">
        正文渲染即将接入。
      </p>
    </template>

    <BaseEmptyState
      v-else
      title="文章不存在"
      description="该文章可能已下架或链接有误。"
    />
  </article>
</template>
