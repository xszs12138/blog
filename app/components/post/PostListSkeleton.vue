<template>
  <div class="space-y-4" aria-busy="true" aria-label="加载文章列表">
    <div
      v-for="i in 3"
      :key="i"
      class="animate-pulse rounded-2xl border border-border bg-blog-card p-5"
    >
      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="aspect-[16/10] rounded-xl bg-muted/25 sm:h-[8.5rem] sm:w-[13.5rem] sm:shrink-0" />
        <div class="flex flex-1 flex-col gap-3">
          <div class="h-6 w-3/4 rounded bg-muted/25" />
          <div class="h-4 w-full rounded bg-muted/20" />
          <div class="h-4 w-2/3 rounded bg-muted/20" />
          <div class="mt-2 h-4 w-1/2 rounded bg-muted/20" />
        </div>
      </div>
    </div>
  </div>
</template>
