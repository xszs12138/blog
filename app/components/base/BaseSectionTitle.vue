<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <h2 class="mb-4 font-heading text-base font-semibold tracking-tight text-foreground">
    {{ title }}
  </h2>
</template>
