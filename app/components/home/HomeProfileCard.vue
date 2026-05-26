<script setup lang="ts">
const { data, status } = await useHomeProfile()

const displayName = computed(() => {
  const name = data.value?.site?.name?.trim()
  if (!name || name === 'xszs-blog') {
    return 'xsZs'
  }
  return name
})

const avatarUrl = computed(() => data.value?.site?.logo?.trim() || '')

const bioLines = computed(() => {
  const desc = data.value?.site?.description?.trim()
  if (desc && desc !== '个人博客') {
    const lines = desc.split(/\n+/).map(line => line.trim()).filter(Boolean)
    if (lines.length > 0) {
      return lines.slice(0, 2)
    }
  }
  return ['喜欢 JRPG、音乐、编程', '偶尔写点东西，记录生活。']
})

const stats = computed(() => {
  const { postCount, categoryCount, tagCount } = data.value?.stats ?? {
    postCount: 0,
    categoryCount: 0,
    tagCount: 0,
  }
  return [
    { label: '文章', value: postCount },
    { label: '分类', value: categoryCount },
    { label: '标签', value: tagCount },
  ]
})

const isLoading = computed(() => status.value === 'pending')
</script>

<template>
  <BaseCard class="w-full">
    <div
      v-if="isLoading"
      class="animate-pulse space-y-6"
      aria-busy="true"
      aria-label="加载个人资料"
    >
      <div class="flex gap-4">
        <div class="size-16 shrink-0 rounded-full bg-muted/30" />
        <div class="flex-1 space-y-2 pt-1">
          <div class="h-5 w-24 rounded bg-muted/30" />
          <div class="h-4 w-full max-w-xs rounded bg-muted/20" />
          <div class="h-4 w-[80%] max-w-sm rounded bg-muted/20" />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4 border-t border-border pt-5">
        <div v-for="i in 3" :key="i" class="space-y-2 text-center">
          <div class="mx-auto h-7 w-10 rounded bg-muted/30" />
          <div class="mx-auto h-3 w-8 rounded bg-muted/20" />
        </div>
      </div>
    </div>

    <template v-else>
      <div class="flex gap-4 sm:gap-5">
        <div class="relative shrink-0">
          <div
            class="size-16 overflow-hidden rounded-full border border-border bg-muted/20 sm:size-[4.5rem]"
          >
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="`${displayName} 头像`"
              class="size-full object-cover"
              loading="lazy"
              decoding="async"
            >
            <div
              v-else
              class="flex size-full items-center justify-center bg-gradient-to-br from-accent/30 to-accent/10 font-heading text-lg font-bold text-accent"
              aria-hidden="true"
            >
              {{ displayName.slice(0, 1).toUpperCase() }}
            </div>
          </div>
          <span
            class="absolute right-0.5 top-0.5 size-3 rounded-full border-2 border-blog-card bg-accent"
            title="在线"
            aria-hidden="true"
          />
        </div>

        <div class="min-w-0 flex-1 pt-0.5">
          <h2 class="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {{ displayName }}
          </h2>
          <p
            v-for="(line, index) in bioLines"
            :key="index"
            class="mt-1 text-sm leading-relaxed text-muted-foreground"
          >
            {{ line }}
          </p>
        </div>
      </div>

      <div
        class="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5 sm:gap-4"
        role="list"
        aria-label="站点统计"
      >
        <div
          v-for="item in stats"
          :key="item.label"
          class="text-center"
          role="listitem"
        >
          <p class="font-heading text-2xl font-semibold tabular-nums text-foreground sm:text-[1.75rem]">
            {{ item.value }}
          </p>
          <p class="mt-1 text-xs text-muted-foreground sm:text-sm">
            {{ item.label }}
          </p>
        </div>
      </div>
    </template>
  </BaseCard>
</template>
