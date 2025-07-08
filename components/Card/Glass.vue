<template>
  <div class="glass-card p-card-padding radius-radius-lg">
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
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(10px);
  margin-left: auto;
  margin-right: auto;
  width: 950px;
  max-width: 100%;
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
