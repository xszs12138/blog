<script setup lang="ts">
import type { TocItem } from '~/types/toc'
import BaseLayout from '~/components/Layout/BaseLayout.vue'
import { enrichNeighborCovers } from '~/utils/post/enrich-post-neighbors'
import { preparePostHtml } from '~/utils/post/prepare-post-html'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { getPostBySlug, getPosts } = usePostsApi()

const pageKey = computed(() => `web-post-page-${slug.value}`)

const { data: pageData } = await useAsyncData(
  () => pageKey.value,
  async () => {
    try {
      const detail = await getPostBySlug(slug.value)
      if (!detail) {
        return null
      }

      let relatedPosts: Awaited<ReturnType<typeof getPosts>>['items'] = []
      if (detail.category?.slug) {
        try {
          const result = await getPosts({
            categorySlug: detail.category.slug,
            page: 1,
            pageSize: 6,
          })
          relatedPosts = result.items
            .filter(item => item.slug !== slug.value)
            .slice(0, 3)
        }
        catch {
          relatedPosts = []
        }
      }

      const post = await enrichNeighborCovers(detail, getPostBySlug, relatedPosts)
      return { post, relatedPosts }
    }
    catch {
      return null
    }
  },
  { watch: [slug] },
)

const post = computed(() => pageData.value?.post ?? null)
const relatedPosts = computed(() => pageData.value?.relatedPosts ?? [])

const prepared = computed(() => {
  if (!post.value?.content?.trim()) {
    return { html: '', toc: [] as TocItem[] }
  }
  return preparePostHtml(post.value.content)
})

const toc = computed(() => prepared.value.toc)

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

              <div
                class="space-y-5 border-t border-border px-5 py-6 md:px-8 md:py-7"
              >
                <PostShareBar :title="post.title" :slug="post.slug" />
                <PostCopyright :post="post" />
              </div>

              <div
                v-if="post.prevPost || post.nextPost || (relatedPosts?.length ?? 0) > 0"
                class="space-y-6 border-t border-border px-5 py-6 md:px-8 md:py-8"
              >
                <PostPrevNextNav
                  v-if="post.prevPost || post.nextPost"
                  :prev-post="post.prevPost"
                  :next-post="post.nextPost"
                />
                <PostRelatedList :posts="relatedPosts" />
              </div>
            </BaseCard>
          </div>
        </template>
        <template #rightSidebar>
          <aside class="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <PostToc v-if="toc.length" :items="toc" :visible-ids="visibleIds" :active-id="activeId"
              class=" hidden md:block" @navigate="scrollToHeading" />
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

