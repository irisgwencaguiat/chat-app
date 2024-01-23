<template>
  <div class="font-Roboto bg-violet-200 flex min-h-screen max-h-screen">
    <RouterView :key="$route.fullPath" />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>
