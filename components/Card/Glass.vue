<template>
  <div class="glass-card">
    <h2 class="title">{{ title }}</h2>
    <p class="description">{{ description }}</p>
    <ChipItem
      v-for="category in categories"
      :key="category"
      :label="category"
      class="chip"
      on-dark
    />
  </div>
</template>

<script setup lang="ts">
import type { GlassCardProps } from "~/types/components/index";

defineProps<GlassCardProps>();
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
.glass-card {
  
  color: black;
  color: white;
  // background: rgba(255, 255, 255, 0.4);
  background: rgba($deep-purple, 0.8);
  border-bottom-left-radius: 1.25rem;
  border-bottom-right-radius: 1.25rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1.25rem;
  margin-left: auto;
  margin-right: auto;
  width: 950px;
  max-width: 100%;
  padding: 2rem;
}

.title {
  font-weight: bold;
  padding: 0 4rem;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.description {
  font-size: 1.2rem;
}

.chip {
  margin-top: 1rem;
}
</style>
