<script setup lang="ts">
const props = defineProps<{
  name: 'facebook' | 'twitter' | 'wechat' | 'weibo' | 'qq'
}>()

const useFallback = ref(false)

const iconMeta: Record<
  typeof props.name,
  { slug: string, color: string, fallback: string }
> = {
  facebook: {
    slug: 'facebook',
    color: '1877F2',
    fallback: 'M9.101 23.691v-7.98H6.127v-3.667h3.125v-1.73c0-3.087 1.851-4.787 4.652-4.787 1.347 0 2.457.1 2.789.145v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.667h-3.12v7.98H9.101z',
  },
  twitter: {
    slug: 'x',
    color: '1D9BF0',
    fallback: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  wechat: {
    slug: 'wechat',
    color: '07C160',
    fallback: 'M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .276.22.5.496.5a.506.506 0 0 0 .283-.09l3.263-1.95a.636.636 0 0 1 .377-.082c.8.1 1.62.152 2.455.152 4.8 0 8.691-3.288 8.691-7.342S13.491 2.188 8.691 2.188z',
  },
  weibo: {
    slug: 'sinaweibo',
    color: 'E6162D',
    fallback: 'M10.098 20.323c-3.977 1.832-8.692-.815-10.531-5.908S-1.087 3.791 3.89 1.959s8.692.815 10.531 5.908-1.386 8.624-5.323 10.456zm-.747-3.006c2.325-.86 3.46-2.888 2.535-4.532-.925-1.644-3.513-2.425-5.838-1.565-2.325.86-3.46 2.888-2.535 4.532.925 1.644 3.513 2.425 5.838 1.565z',
  },
  qq: {
    slug: 'qq',
    color: '12B7F5',
    fallback: 'M12 2C6.477 2 2 5.477 2 9.5c0 1.89.98 3.58 2.52 4.74-.31.93-.98 2.64-1.01 2.96-.04.46.34.84.8.72 1.01-.28 2.24-.72 2.91-1.01.74.21 1.52.33 2.33.33 5.523 0 10-3.477 10-7.5S17.523 2 12 2zm-2.17 5.3a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zm4.34 0a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zM7.5 16.8c1.47 1.16 3.55 1.9 5.88 1.9 2.33 0 4.41-.74 5.88-1.9.42-.33.1-1.05-.48-1.05-1.26.58-2.94.95-4.8.95s-3.54-.37-4.8-.95c-.58 0-.9.72-.48 1.05z',
  },
}

const meta = computed(() => iconMeta[props.name])

const src = computed(
  () => `https://cdn.simpleicons.org/${meta.value.slug}/${meta.value.color}`,
)

function onImgError() {
  useFallback.value = true
}

watch(() => props.name, () => {
  useFallback.value = false
})
</script>

<template>
  <svg
    v-if="useFallback"
    class="size-[1.125rem] shrink-0"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path :d="meta.fallback" />
  </svg>
  <img
    v-else
    :src="src"
    alt=""
    class="size-[1.125rem] shrink-0"
    role="presentation"
    width="18"
    height="18"
    loading="lazy"
    decoding="async"
    @error="onImgError"
  >
</template>
