<script lang="ts" setup>
import { ArrowUp } from '@lucide/vue'

const { height } = useWindowSize()
const { y } = useWindowScroll()

const isShow = computed(() => {
  return y.value > height.value / 2
})

// watchEffect(() => {
//   console.log(y.value, height.value)
// })
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <ClientOnly>
    <BaseIconButton v-if="isShow" label="返回顶部"
      class="fixed size-10 right-10 bottom-10 z-50 cursor-pointer transition-all duration-300" @click="scrollToTop">
      <ArrowUp class="size-5 text-blog-nav-fg" />
    </BaseIconButton>
  </ClientOnly>
</template>
