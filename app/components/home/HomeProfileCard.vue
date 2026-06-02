<script setup lang="ts">
import { IdCard } from '@lucide/vue'

const { data } = await useHomeProfile()

const displayName = computed(() => {
  const name = data.value?.site?.name?.trim()
  if (!name || name === 'xszs-blog') {
    return 'xsZs'
  }
  return name
})

const avatarUrl = 'https://bu.dusays.com/2026/02/15/69918a5bbfefa.webp'

const bioLines = computed(() => {
  const desc = data.value?.site?.description?.trim()
  if (desc && desc !== '个人博客') {
    const lines = desc.split(/\n+/).map(line => line.trim()).filter(Boolean)
    if (lines.length > 0) {
      return lines.slice(0, 2)
    }
  }
  return '喜欢 JRPG、音乐、编程。偶尔写点东西，记录生活。'
})
</script>

<template>
  <BaseCard class="w-full">
    <div class="flex flex-col items-center justify-center gap-4">
      <NuxtLink
        to="/about"
        class="group relative block h-52 w-full cursor-pointer overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        aria-label="查看关于我"
      >
        <img
          class="size-full object-cover transition-[filter,transform] duration-300 ease-out group-hover:scale-[1.02] group-hover:brightness-[0.42]"
          :src="avatarUrl"
          :alt="displayName"
        >
        <span
          class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        >
          <IdCard
            class="size-14 text-white drop-shadow-[0_2px_8px_rgb(0_0_0/45%)]"
            :stroke-width="1.35"
          />
        </span>
      </NuxtLink>
      <p class="font-bold text-accent">
        {{ displayName }}
      </p>
      <p class="text-center text-sm text-muted-foreground">
        {{ bioLines }}
      </p>
    </div>
  </BaseCard>
</template>
