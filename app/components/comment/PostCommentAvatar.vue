<script setup lang="ts">
const props = defineProps<{
  nickname: string
}>()

const initial = computed(() => {
  const text = props.nickname.trim()
  return text ? text.charAt(0).toUpperCase() : '?'
})
</script>

<template>
  <span
    class="post-comment-avatar"
    :aria-label="`${nickname} 的头像`"
    role="img"
  >
    {{ initial }}
  </span>
</template>

<style scoped>
.post-comment-avatar {
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid var(--blog-border);
  background: var(--blog-surface-muted);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--blog-accent);
}
</style>
