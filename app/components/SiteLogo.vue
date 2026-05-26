<script setup lang="ts">
defineProps<{
  /** 仅图标，不显示品牌文字 */
  iconOnly?: boolean
}>()

const gradientId = useId()
</script>

<template>
  <NuxtLink
    to="/"
    class="group inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#5ee9b5]/50"
    aria-label="xsZs 首页"
  >
    <span class="relative flex size-8 shrink-0 items-center justify-center" aria-hidden="true">
      <svg
        class="size-8 transition-transform duration-300 group-hover:rotate-45"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 2.5L18.2 11.2L27 9.5L20.8 15.5L27 22.5L18.2 20.8L16 29.5L13.8 20.8L5 22.5L11.2 16.5L5 9.5L13.8 11.2L16 2.5Z"
          :fill="`url(#${gradientId})`"
        />
        <circle cx="16" cy="16" r="3.25" fill="#0a0c10" />
        <defs>
          <linearGradient
            :id="gradientId"
            x1="5"
            y1="5"
            x2="27"
            y2="27"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#6ee7b7" />
            <stop offset="1" stop-color="#34d399" />
          </linearGradient>
        </defs>
      </svg>
    </span>
    <span
      v-if="!iconOnly"
      class="font-heading text-lg font-semibold tracking-tight text-blog-nav-fg"
    >
      xsZs
    </span>
  </NuxtLink>
</template>
