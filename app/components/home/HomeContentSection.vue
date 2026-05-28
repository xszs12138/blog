<script setup lang="ts">
import BaseLayout from '../Layout/BaseLayout.vue'
</script>

<template>
  <BaseLayout class="xl:min-h-[calc(100svh-2rem)]">
    <template #content>
      <PostList />
    </template>
  </BaseLayout>
</template>
