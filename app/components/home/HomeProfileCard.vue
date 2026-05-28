<script setup lang="ts">
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
    <div class="flex flex-col gap-4 items-center justify-center">
      <img class=" h-52 w-full rounded-t-3xl object-cover" :src="avatarUrl" :alt="displayName">
      <p class=" font-bold text-accent">
        {{ displayName }}
      </p>
      <p class="text-sm text-gray-500">
        {{ bioLines }}
      </p>
    </div>
  </BaseCard>
</template>
