<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  label: string
}>()
</script>

<template>
  <span class="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
    <component :is="icon" class="size-3.5 shrink-0 opacity-80" aria-hidden="true" />
    <span>{{ label }}</span>
  </span>
</template>
