<script setup lang="ts">
import { enhancePostCodeBlocks } from '~/utils/post/enhance-post-code-blocks'

const props = defineProps<{
  html: string
}>()

const articleRef = ref<HTMLElement | null>(null)

function enhance() {
  nextTick(() => {
    enhancePostCodeBlocks(articleRef.value)
  })
}

watch(() => props.html, enhance)

onMounted(enhance)

defineExpose({
  articleRef,
})
</script>

<template>
  <div ref="articleRef" class="post-content" v-html="html" />
</template>
