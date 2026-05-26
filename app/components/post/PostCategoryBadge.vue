<script setup lang="ts">
import { categoryBadgeClass } from '~/utils/category-style'

defineProps<{
  name: string
  slug?: string
}>()
</script>

<template>
  <span :class="categoryBadgeClass(slug, name)">
    {{ name }}
  </span>
</template>
