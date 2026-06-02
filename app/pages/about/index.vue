<script lang="ts" setup>
import PolaroidItem from '~/components/about/PolaroidItem.vue'
import BaseLayout from '~/components/Layout/BaseLayout.vue'
import { prepareAboutHtml } from '~/utils/site/prepare-about-html'

definePageMeta({
  layout: 'default',
})

const { getSite } = useSiteApi()

const { data: site } = await useAsyncData('web-site-about', () => getSite())

const prepared = computed(() => prepareAboutHtml(site.value?.about ?? ''))

useHead(() => ({
  title: '关于 | xsZs Blog',
}))

/** 文件名与内容不一致时按实际二维码对应 alt */
const images = [
  { src: '/images/wechat.jpg', alt: '抖音' },
  { src: '/images/douyin.jpg', alt: '微信' },
] as const
</script>

<template>
  <BaseLayout mode="detail">
    <template #content>
      <BaseCard class="overflow-hidden p-0 shadow-md dark:shadow-black/30">
        <div class="border-b border-border px-5 py-6 md:px-8 md:py-8">
          <h1 class="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            关于
          </h1>
          <p v-if="site?.description" class="mt-2 text-sm text-muted-foreground">
            {{ site.description }}
          </p>
        </div>

        <div class="px-5 py-6 md:px-8 md:py-8">
          <PostArticleBody v-if="prepared.html" :html="prepared.html" />
          <p v-else class="text-muted-foreground">
            暂无关于页内容，请在后台「站点设置」中编辑。
          </p>
        </div>
      </BaseCard>
      <section class="mt-8 xl:mt-12" aria-labelledby="about-contact-heading">
        <ul
          class="mx-auto grid max-w-xl list-none grid-cols-1 gap-10 px-2 sm:max-w-2xl sm:grid-cols-2 sm:gap-8 md:gap-12"
          role="list">
          <li v-for="(image, index) in images" :key="image.src" class="flex justify-center">
            <PolaroidItem :image="image" :index="index" />
          </li>
        </ul>
      </section>
    </template>
  </BaseLayout>
</template>
