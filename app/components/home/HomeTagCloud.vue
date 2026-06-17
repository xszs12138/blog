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
      <NuxtLink v-for="tag in tags" :key="tag.id" :to="{ path: '/post', query: { tagSlug: tag.slug } }"
        class="blog-tag-chip inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--blog-accent)_22%,var(--blog-border))] bg-(--blog-chip-bg) px-3 py-1.5 text-xs shadow-sm transition-colors hover:border-accent/35 hover:bg-(--blog-surface-hover)">
        <span>{{ tag.name }}</span>
        <span class="tabular-nums text-muted-foreground">{{ tag.postCount }}</span>
      </NuxtLink>
    </div>
  </BaseCard>
</template>
