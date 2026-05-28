<script setup lang="ts">
import { HOME_POST_PAGE_SIZE } from '~/composables/use-home-posts'

const props = withDefaults(
  defineProps<{
    pageSize?: number
    listKeyPrefix?: string
    scrollToPostsAnchor?: boolean
    emptyTitle?: string
    emptyDescription?: string
  }>(),
  {
    pageSize: HOME_POST_PAGE_SIZE,
    listKeyPrefix: 'home-posts',
    scrollToPostsAnchor: true,
    emptyTitle: '暂无文章',
    emptyDescription: '发布第一篇文章后，会显示在这里。',
  },
)

const {
  page,
  posts,
  totalPages,
} = await usePostsList({
  pageSize: props.pageSize,
  keyPrefix: props.listKeyPrefix,
  scrollToPostsAnchor: props.scrollToPostsAnchor,
})

const isEmpty = computed(() => posts.value.length === 0)
</script>

<template>
  <section id="posts" class="flex h-full flex-1 flex-col scroll-mt-24" aria-label="文章列表">
    <BaseEmptyState v-if="isEmpty" :title="emptyTitle" :description="emptyDescription" />
    <div v-else class="flex flex-1 flex-col">
      <ul class="list-none space-y-4 p-0">
        <li v-for="post in posts" :key="post.id">
          <PostCard :post="post" />
        </li>
      </ul>
      <footer class="post-list-footer mt-auto pt-10">
        <BasePagination :page="page" :total-pages="totalPages" @update:page="page = $event" />
      </footer>
    </div>
  </section>
</template>
