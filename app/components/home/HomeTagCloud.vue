<script setup lang="ts">
const { data } = await useHomeSidebar()

const tags = computed(() => data.value?.tags ?? [])
</script>

<template>
  <BaseCard title="标签">
    <p v-if="!tags.length" class="text-sm text-muted-foreground">
      暂无标签
    </p>

    <div v-else class="flex flex-wrap gap-2">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.id"
        :to="{ path: '/post', query: { tagSlug: tag.slug } }"
        class="inline-flex items-center gap-1 rounded-full border border-border bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent/30 hover:text-foreground"
      >
        <span>{{ tag.name }}</span>
        <span class="tabular-nums opacity-70">{{ tag.postCount }}</span>
      </NuxtLink>
    </div>
  </BaseCard>
</template>
