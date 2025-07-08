<template>
  <div class="card p-card-padding-sm radius-radius-xs" :class="[url && 'hoverable', color || 'primary']">
    <template v-if="categories?.length">
      <ChipItem
        v-for="category in categories"
        :key="category"
        :label="category"
        class="chip"
      />
    </template>
    <h2 class="title">{{ title }}</h2>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import type { CardProps } from "@/types/components/index";

defineProps<CardProps>();
</script>

<style scoped lang="scss">
@use "/assets/colors" as *;
@use "sass:color";

.card {
  height: 16rem;
  color: $text-color;
  background-color: white;
}

.primary {
  border: 1px solid $medium-purple;
}

.secondary {
  border: 1px solid $light-blue;
}

.hoverable {
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    -webkit-box-shadow: 0px 0px 2.5rem -22px color.scale($text-color, $alpha: -0.85%);
    -moz-box-shadow: 0px 0px 2.5rem -22px color.scale($text-color, $alpha: -0.85%);
    box-shadow: 0px 0px 2.5rem -22px color.scale($text-color, $alpha: -0.85%);
  }
}

.title {
  font-weight: bold;
}

.chip {
  margin-right: 0.75rem;
  margin-bottom: 0.5rem;
}
</style>
