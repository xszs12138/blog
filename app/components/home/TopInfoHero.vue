<script setup lang="ts">
import type { Component } from 'vue'
import type { SocialLink } from '~/types/site'
import { Gamepad2, Mail } from '@lucide/vue'
import BilibiliIcon from '@/components/icons/BilibiliIcon.vue'
import GithubIcon from '@/components/icons/GithubIcon.vue'

const props = withDefaults(
  defineProps<{
    siteName?: string
    socialLinks?: SocialLink[]
  }>(),
  {
    siteName: 'xsZs',
    socialLinks: () => [],
  },
)

interface SocialItem {
  key: string
  label: string
  url: string
  icon: Component
}

const defaultSocialItems: SocialItem[] = [
  { key: 'github', label: 'GitHub', url: 'https://github.com', icon: GithubIcon },
  { key: 'bilibili', label: 'Bilibili', url: 'https://www.bilibili.com', icon: BilibiliIcon },
  { key: 'game', label: '游戏', url: '#games', icon: Gamepad2 },
  { key: 'email', label: '邮箱', url: 'mailto:hello@example.com', icon: Mail },
]

const iconByName: Record<string, Component> = {
  github: GithubIcon,
  bilibili: BilibiliIcon,
  game: Gamepad2,
  gamepad: Gamepad2,
  games: Gamepad2,
  email: Mail,
  mail: Mail,
}

const socialItems = computed<SocialItem[]>(() => {
  if (!props.socialLinks.length) {
    return defaultSocialItems
  }

  return props.socialLinks
    .map((link) => {
      const key = link.name.toLowerCase()
      const icon = iconByName[key]
      if (!icon) {
        return null
      }
      return {
        key,
        label: link.name,
        url: link.url,
        icon,
      }
    })
    .filter((item): item is SocialItem => item !== null)
})

const displaySocialItems = computed(() =>
  socialItems.value.length ? socialItems.value : defaultSocialItems,
)
</script>

<template>
  <div class="top-info-hero relative z-2 flex min-h-[inherit] flex-col items-center justify-center gap-8 px-5 pt-24 pb-12 text-center sm:gap-10 sm:px-6 sm:pt-26 sm:pb-14 lg:gap-11 lg:pb-16">
    <div class="flex w-full max-w-2xl flex-col items-center gap-4">
      <h1 class="top-info-hero__title m-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-heading font-bold leading-tight tracking-tight text-white">
        <span>Hi, I'm</span>
        <span class="top-info-hero__name">{{ siteName }}</span>
        <span class="top-info-hero__wave" aria-hidden="true">👋</span>
      </h1>

      <div class="flex flex-col items-center gap-1.5">
        <p class="top-info-hero__desc m-0">
          一名热爱游戏与代码的独立开发者。
        </p>
        <p class="top-info-hero__desc m-0">
          记录所思所想，分享技术与生活。
        </p>
      </div>
    </div>

    <ul class="m-0 flex list-none flex-wrap items-center justify-center gap-3.5 p-0">
      <li v-for="item in displaySocialItems" :key="item.key">
        <a
          :href="item.url"
          class="top-info-hero__social-btn inline-flex size-11 items-center justify-center rounded-full"
          :aria-label="item.label"
          :target="item.url.startsWith('mailto:') ? undefined : '_blank'"
          :rel="item.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'"
        >
          <component :is="item.icon" class="size-5" aria-hidden="true" />
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.top-info-hero__title {
  font-size: clamp(2.25rem, 6vw, 3.75rem);
}

.top-info-hero__name {
  color: var(--blog-hero-accent);
}

.top-info-hero__wave {
  display: inline-block;
  animation: top-info-wave 2.4s ease-in-out infinite;
  transform-origin: 70% 70%;
}

.top-info-hero__desc {
  max-width: 36rem;
  font-size: clamp(0.9375rem, 2.2vw, 1.125rem);
  line-height: 1.85;
  color: rgb(255 255 255 / 88%);
}

.top-info-hero__social-btn {
  border: 1px solid rgb(255 255 255 / 12%);
  background: rgb(0 0 0 / 35%);
  color: rgb(255 255 255 / 88%);
  backdrop-filter: blur(8px);
  transition:
    transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1),
    border-color 0.25s ease,
    background-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.35s ease;
}

.top-info-hero__social-btn:hover {
  transform: translateY(-3px) scale(1.06);
  border-color: rgb(136 192 150 / 45%);
  background: rgb(136 192 150 / 12%);
  color: #fff;
  box-shadow: 0 8px 24px rgb(0 0 0 / 35%);
}

.top-info-hero__social-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgb(136 192 150 / 55%);
}

@keyframes top-info-wave {

  0%,
  100% {
    transform: rotate(0deg);
  }

  12% {
    transform: rotate(14deg);
  }

  24% {
    transform: rotate(-8deg);
  }

  36% {
    transform: rotate(14deg);
  }

  48% {
    transform: rotate(-4deg);
  }

  60% {
    transform: rotate(10deg);
  }

  72% {
    transform: rotate(0deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .top-info-hero__wave {
    animation: none;
  }

  .top-info-hero__social-btn {
    transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
  }

  .top-info-hero__social-btn:hover {
    transform: none;
  }
}
</style>
