<script setup lang="ts">
import type { TocItem } from '~/types/toc'
import BaseLayout from '~/components/Layout/BaseLayout.vue'
import { preparePostHtml } from '~/utils/post/prepare-post-html'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { getPostBySlug, getPosts } = usePostsApi()

const postKey = computed(() => `web-post-${slug.value}`)

const { data: post } = await useAsyncData(
  () => postKey.value,
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

const prepared = computed(() => {
  if (!post.value?.content?.trim()) {
    return { html: '', toc: [] as TocItem[] }
  }
  return preparePostHtml(post.value.content)
})

const toc = computed(() => prepared.value.toc)

const relatedKey = computed(() => `web-post-related-${slug.value}`)

const { data: relatedPosts } = await useAsyncData(
  () => relatedKey.value,
  async () => {
    if (!post.value?.category?.slug) {
      return []
    }
    try {
      const result = await getPosts({
        categorySlug: post.value.category.slug,
        page: 1,
        pageSize: 4,
      })
      return result.items.filter(item => item.slug !== slug.value).slice(0, 3)
    }
    catch {
      return []
    }
  },
  { watch: [post, slug] },
)

const articleBodyRef = ref<{ articleRef: HTMLElement | null } | null>(null)
const articleRef = computed((): HTMLElement | null => {
  const target = articleBodyRef.value?.articleRef
  return target ?? null
})

const { visibleIds, activeId, scrollToHeading } = useArticleToc(articleRef, toc)

const hasCover = computed(() => Boolean(post.value?.cover?.trim()))

useHead(() => ({
  title: post.value?.title ? `${post.value.title} | xsZs Blog` : '文章详情',
}))
</script>

<template>
  <div class="post-detail">
    <template v-if="post">
      <PostDetailHero v-if="hasCover" :cover="post.cover" :title="post.title" />

      <BaseLayout>
        <template #content>
          <div class="min-w-0">
            <BaseCard class="post-detail__card overflow-hidden p-0 shadow-md dark:shadow-black/30">
              <div class="border-b border-border px-5 py-6 md:px-8 md:py-8">
                <PostDetailHeader :post="post" :content-html="prepared.html" />
              </div>

              <div class="px-5 py-6 md:px-8 md:py-8">
                <PostArticleBody v-if="prepared.html" ref="articleBodyRef" :html="prepared.html" />
                <p v-else class="text-muted-foreground">
                  暂无正文内容。
                </p>
              </div>

              <nav v-if="post.prevPost || post.nextPost"
                class="flex flex-col gap-3 border-t border-border bg-white/2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8 dark:bg-white/2"
                aria-label="上一篇下一篇">
                <NuxtLink v-if="post.prevPost" :to="`/post/${post.prevPost.slug}`"
                  class="post-detail__nav-link max-w-[min(100%,20rem)]">
                  <span class="block text-xs text-muted-foreground">上一篇</span>
                  <span class="mt-0.5 line-clamp-2 text-sm font-medium text-foreground">
                    {{ post.prevPost.title }}
                  </span>
                </NuxtLink>
                <span v-else class="hidden sm:block" />

                <NuxtLink v-if="post.nextPost" :to="`/post/${post.nextPost.slug}`"
                  class="post-detail__nav-link max-w-[min(100%,20rem)] sm:text-right">
                  <span class="block text-xs text-muted-foreground">下一篇</span>
                  <span class="mt-0.5 line-clamp-2 text-sm font-medium text-foreground">
                    {{ post.nextPost.title }}
                  </span>
                </NuxtLink>
              </nav>
            </BaseCard>
          </div>
        </template>
        <template #rightSidebar>
          <aside class="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <PostToc v-if="toc.length" :items="toc" :visible-ids="visibleIds" :active-id="activeId"
              class=" hidden md:block" @navigate="scrollToHeading" />
            <PostRelatedList :posts="relatedPosts ?? []" />
            <BaseCard title="最新文章" />
          </aside>
        </template>
      </BaseLayout>
    </template>

    <main v-else class="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <div class="text-center">
        <BaseEmptyState title="文章不存在" description="该文章可能已下架或链接有误。" />
        <NuxtLink to="/home" class="mt-4 inline-flex text-sm text-accent transition-colors hover:text-accent/80">
          返回首页
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<style scoped>
.post-detail__nav-link {
  border-radius: 0.75rem;
  padding: 0.65rem 0.85rem;
  outline: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.post-detail__nav-link:hover {
  background: rgb(255 255 255 / 5%);
}

.post-detail__nav-link:focus-visible {
  box-shadow: 0 0 0 2px rgb(136 192 150 / 45%);
}
</style>
