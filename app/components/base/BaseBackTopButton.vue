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
    <BaseIconButton
      v-if="isShow"
      label="返回顶部"
      class="fixed bottom-4 right-4 z-40 size-10 cursor-pointer transition-all duration-300 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10"
      @click="scrollToTop"
    >
      <ArrowUp class="size-5 text-blog-nav-fg" />
    </BaseIconButton>
  </ClientOnly>
</template>
