<script setup lang="ts">
import { buildHomeActivities } from '~/composables/use-home-activities'

const { posts, status: postsStatus } = useHomePosts()

const activities = computed(() => buildHomeActivities(posts.value))
const activitiesLoading = computed(() => postsStatus.value === 'pending')
</script>

<template>
  <section class="relative z-10 -mt-20 px-4 pb-16 pt-0 sm:-mt-24 md:px-6" aria-label="博客内容">
    <div class="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start">
      <div class="flex min-h-[calc(100svh-12rem)] flex-col">
        <PostList />
      </div>
      <aside class="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
        <HomeProfileCard />
        <HomeCategoryList />
        <HomeTagCloud />
        <HomeActivityTimeline :items="activities" :loading="activitiesLoading" />
      </aside>
    </div>
  </section>
</template>
