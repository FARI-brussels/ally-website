<template>
  <div class="chip" :class="{ onDark }">{{ label }}</div>
</template>

<script setup lang="ts">
import type { ChipProps } from "~/types/components/index";

defineProps<ChipProps>();
</script>

<style scoped lang="scss">
@use "/assets/scss/colors.scss" as *;
@use "sass:color";

.chip {
  display: inline-block;
  padding: 0.125rem 0.625rem;
  border-radius: 1.25rem;
  background-color: color.adjust($medium-purple, $alpha: -0.75);
  color: $text-color;
  font-size: 0.875rem;
  font-weight: 600;
}

.onDark {
  background-color: color.adjust(white, $alpha: -0.6);
}
</style>
