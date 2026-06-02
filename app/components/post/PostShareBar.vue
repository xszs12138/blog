<script setup lang="ts">
import { Link2 } from '@lucide/vue'
import ShareBrandIcon from '~/components/post/share/ShareBrandIcon.vue'
import { buildPostShareLinks, copyPostLink, usePostShareUrl } from '~/composables/use-post-share'
import { cn } from '~/utils/common/cn'

type SharePlatform =
  | {
    id: 'wechat'
    label: string
    action: 'copy'
    className: string
  }
  | {
    id: 'facebook' | 'twitter' | 'weibo' | 'qq'
    label: string
    href: () => string
    className: string
  }

const props = defineProps<{
  title: string
  slug: string
}>()

const shareUrl = usePostShareUrl(props.slug)

const links = computed(() =>
  buildPostShareLinks({ url: shareUrl.value, title: props.title }),
)

const linkCopied = ref(false)
const wechatCopied = ref(false)
let linkCopyTimer: ReturnType<typeof setTimeout> | undefined
let wechatCopyTimer: ReturnType<typeof setTimeout> | undefined

const platforms: SharePlatform[] = [
  {
    id: 'facebook',
    label: '分享到 Facebook',
    href: () => links.value.facebook,
    className: 'text-[#1877f2] border-[#1877f2]/35 hover:border-[#1877f2] hover:bg-[#1877f2]/10',
  },
  {
    id: 'twitter',
    label: '分享到 X (Twitter)',
    href: () => links.value.twitter,
    className: 'text-[#1d9bf0] border-[#1d9bf0]/35 hover:border-[#1d9bf0] hover:bg-[#1d9bf0]/10',
  },
  {
    id: 'wechat',
    label: '复制链接（微信分享）',
    action: 'copy',
    className: 'text-[#07c160] border-[#07c160]/35 hover:border-[#07c160] hover:bg-[#07c160]/10',
  },
  {
    id: 'weibo',
    label: '分享到微博',
    href: () => links.value.weibo,
    className: 'text-[#e6162d] border-[#e6162d]/35 hover:border-[#e6162d] hover:bg-[#e6162d]/10',
  },
  {
    id: 'qq',
    label: '分享到 QQ',
    href: () => links.value.qq,
    className: 'text-[#12b7f5] border-[#12b7f5]/35 hover:border-[#12b7f5] hover:bg-[#12b7f5]/10',
  },
]

async function onCopyWechat() {
  const ok = await copyPostLink(shareUrl.value)
  if (!ok) {
    return
  }
  wechatCopied.value = true
  if (wechatCopyTimer) {
    clearTimeout(wechatCopyTimer)
  }
  wechatCopyTimer = setTimeout(() => {
    wechatCopied.value = false
  }, 2000)
}

async function onCopyLink() {
  const ok = await copyPostLink(shareUrl.value)
  if (!ok) {
    return
  }
  linkCopied.value = true
  if (linkCopyTimer) {
    clearTimeout(linkCopyTimer)
  }
  linkCopyTimer = setTimeout(() => {
    linkCopied.value = false
  }, 2000)
}

function openShare(url: string) {
  if (!import.meta.client) {
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=520')
}

function isCopyPlatform(item: SharePlatform): item is Extract<SharePlatform, { action: 'copy' }> {
  return item.action === 'copy'
}

onBeforeUnmount(() => {
  if (linkCopyTimer) {
    clearTimeout(linkCopyTimer)
  }
  if (wechatCopyTimer) {
    clearTimeout(wechatCopyTimer)
  }
})
</script>

<template>
  <section class="post-share" aria-label="分享文章">
    <p class="post-share__label">
      分享至
    </p>
    <div class="post-share__bar">
      <template v-for="item in platforms" :key="item.id">
        <button
          v-if="isCopyPlatform(item)"
          type="button"
          :class="cn(
            'post-share__btn',
            item.className,
            wechatCopied && 'border-[#07c160] bg-[#07c160]/15',
          )"
          :aria-label="item.label"
          @click="onCopyWechat"
        >
          <ShareBrandIcon :name="item.id" />
        </button>
        <button
          v-else
          type="button"
          :class="cn('post-share__btn', item.className)"
          :aria-label="item.label"
          @click="openShare(item.href())"
        >
          <ShareBrandIcon :name="item.id" />
        </button>
      </template>

      <span class="post-share__divider" aria-hidden="true" />

      <button
        type="button"
        :class="cn(
          'post-share__btn post-share__btn--copy',
          linkCopied && 'border-accent text-accent bg-accent/10',
        )"
        :aria-label="linkCopied ? '链接已复制' : '复制文章链接'"
        @click="onCopyLink"
      >
        <Link2 class="size-4 shrink-0" aria-hidden="true" />
        <span class="text-xs font-medium">{{ linkCopied ? '已复制' : '复制链接' }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.post-share {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.post-share__label {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--blog-muted);
}

.post-share__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--blog-border);
  background: rgb(255 255 255 / 4%);
}

:root:not(.dark) .post-share__bar {
  background: rgb(15 20 25 / 4%);
}

.post-share__btn {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid var(--blog-border);
  background: rgb(255 255 255 / 3%);
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.post-share__btn:hover {
  transform: translateY(-1px);
}

.post-share__btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgb(94 233 181 / 40%);
}

.post-share__btn--copy {
  width: auto;
  height: 2.5rem;
  gap: 0.35rem;
  padding: 0 0.85rem;
  color: var(--blog-muted);
  border-color: var(--blog-border);
}

.post-share__btn--copy:hover {
  color: var(--blog-fg);
  border-color: var(--blog-accent);
  background: rgb(94 233 181 / 8%);
}

.post-share__divider {
  width: 1px;
  height: 1.25rem;
  background: var(--blog-border);
}
</style>
