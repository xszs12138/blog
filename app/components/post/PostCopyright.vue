<script setup lang="ts">
import type { PostDetail } from '~/types/post'
import { Calendar, ExternalLink, FileText, Info, ShieldCheck, User } from '@lucide/vue'
import { CC_LICENSE } from '~/constants/copyright'
import { usePostShareUrl } from '~/composables/use-post-share'
import { formatPostDate } from '~/utils/common/format-post-date'

const props = defineProps<{
  post: PostDetail
  author?: string
}>()

const { getSite } = useSiteApi()

const { data: site } = await useAsyncData('web-site-copyright', async () => {
  try {
    return await getSite()
  }
  catch {
    return null
  }
})

const authorName = computed(
  () => props.author?.trim() || site.value?.name?.trim() || 'xsZs',
)
const publishedLabel = computed(() => formatPostDate(props.post.publishedAt) || '—')
const articleUrl = usePostShareUrl(props.post.slug)
</script>

<template>
  <section class="post-copyright" aria-labelledby="post-copyright-heading">
    <span class="post-copyright__watermark" aria-hidden="true">CC</span>

    <div class="post-copyright__head">
      <ShieldCheck class="size-5 shrink-0 text-accent" aria-hidden="true" />
      <h2 id="post-copyright-heading" class="post-copyright__title">
        版权声明
      </h2>
    </div>

    <p class="post-copyright__desc">
      本文由作者采用
      <a
        :href="CC_LICENSE.deedUrl"
        target="_blank"
        rel="license noopener noreferrer"
        class="post-copyright__link"
      >
        {{ CC_LICENSE.name }}
      </a>
      许可协议发布。转载请注明出处并附带原文链接。
    </p>

    <div class="post-copyright__meta">
      <dl class="post-copyright__grid">
        <div class="post-copyright__item">
          <dt class="post-copyright__item-label">
            <User class="size-3.5 shrink-0 text-accent" aria-hidden="true" />
            作者
          </dt>
          <dd class="post-copyright__item-value">
            {{ authorName }}
          </dd>
        </div>
        <div class="post-copyright__item">
          <dt class="post-copyright__item-label">
            <Calendar class="size-3.5 shrink-0 text-accent" aria-hidden="true" />
            发布于
          </dt>
          <dd class="post-copyright__item-value">
            {{ publishedLabel }}
          </dd>
        </div>
        <div class="post-copyright__item">
          <dt class="post-copyright__item-label">
            <FileText class="size-3.5 shrink-0 text-accent" aria-hidden="true" />
            许可协议
          </dt>
          <dd class="post-copyright__item-value">
            <a
              :href="CC_LICENSE.deedUrl"
              target="_blank"
              rel="license noopener noreferrer"
              class="post-copyright__link inline-flex items-center gap-1"
            >
              {{ CC_LICENSE.name }}
              <ExternalLink class="size-3 shrink-0 opacity-80" aria-hidden="true" />
            </a>
          </dd>
        </div>
      </dl>

      <p class="post-copyright__footer-note">
        <Info class="size-3.5 shrink-0 text-accent" aria-hidden="true" />
        <span>完整协议内容请查看：</span>
        <a
          :href="CC_LICENSE.legalUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="post-copyright__link inline-flex items-center gap-1"
        >
          Creative Commons 完整协议
          <ExternalLink class="size-3 shrink-0 opacity-80" aria-hidden="true" />
        </a>
      </p>
      <p class="post-copyright__url">
        <span class="text-muted-foreground">原文链接：</span>
        <a :href="articleUrl" class="post-copyright__link break-all">
          {{ articleUrl }}
        </a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.post-copyright {
  position: relative;
  overflow: hidden;
  padding: 1.25rem 1.35rem;
  border-radius: 0.875rem;
  border: 1px solid var(--blog-border);
  background: rgb(255 255 255 / 3%);
}

:root:not(.dark) .post-copyright {
  background: rgb(15 20 25 / 2%);
}

.post-copyright__watermark {
  position: absolute;
  top: 50%;
  right: -0.25rem;
  transform: translateY(-50%);
  font-size: clamp(5rem, 18vw, 7.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
  color: var(--blog-accent);
  opacity: 0.08;
  pointer-events: none;
  user-select: none;
}

.post-copyright__head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-copyright__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--blog-fg);
}

.post-copyright__desc {
  position: relative;
  z-index: 1;
  margin: 0.75rem 0 0;
  max-width: 42rem;
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--blog-muted);
}

.post-copyright__link {
  color: var(--blog-accent);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.post-copyright__link:hover {
  opacity: 0.85;
  text-decoration: underline;
}

.post-copyright__meta {
  position: relative;
  z-index: 1;
  margin-top: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 0.65rem;
  border: 1px solid var(--blog-border);
  background: rgb(0 0 0 / 12%);
}

:root:not(.dark) .post-copyright__meta {
  background: rgb(255 255 255 / 72%);
}

.post-copyright__grid {
  display: grid;
  gap: 1rem;
  margin: 0;
}

@media (min-width: 640px) {
  .post-copyright__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
  }
}

.post-copyright__item {
  margin: 0;
}

.post-copyright__item-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-size: 0.75rem;
  color: var(--blog-muted);
}

.post-copyright__item-value {
  margin: 0.35rem 0 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--blog-fg);
}

.post-copyright__footer-note,
.post-copyright__url {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin: 0.85rem 0 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--blog-muted);
}

.post-copyright__url {
  margin-top: 0.5rem;
  padding-top: 0.65rem;
  border-top: 1px dashed var(--blog-border);
}
</style>
