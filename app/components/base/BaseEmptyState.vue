<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="rounded-2xl border border-dashed border-border bg-blog-card/60 px-6 py-12 text-center">
    <p class="font-medium text-foreground">
      {{ title }}
    </p>
    <p v-if="description" class="mt-2 text-sm text-muted-foreground">
      {{ description }}
    </p>
  </div>
</template>
