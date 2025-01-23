<template>
  <div
    class="card"
    :class="[props.url && 'hoverable', props.color || 'primary']"
  >
    <template v-if="props.categories?.length">
      <ChipItem
        v-for="category in props.categories"
        :key="category"
        :label="category.label"
        class="chip"
        :class="category.value"
      />
    </template>
    <h2 class="title">{{ props.title }}</h2>
    <p class="description">{{ truncatedDescription }}</p>
    <img v-if="image" :src="image" class="image" />
  </div>
</template>

<script setup lang="ts">
import type { CardProps } from "~/types/components/index";

const props = defineProps<CardProps>();

const truncatedDescription = computed(() => {
  if (!props.description) return "";

  const maxLength = 200;
  return props.description.length > maxLength
    ? props.description.slice(0, maxLength) + "..."
    : props.description;
});
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "sass:color";

.card {
  min-width: 24rem;
  max-width: 50%;
  height: 20rem;
  color: $text-color;
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
}

.primary {
  border: 2px solid $medium-purple;
}

.secondary {
  border: 2px solid $light-blue;
}

.hoverable {
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    -webkit-box-shadow: 0px 0px 2.5rem -26px color.scale($text-color, $alpha: -0.8%);
    -moz-box-shadow: 0px 0px 2.5rem -26px color.scale($text-color, $alpha: -0.8%);
    box-shadow: 0px 0px 2.5rem -26px color.scale($text-color, $alpha: -0.8%);
  }
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

.chip {
  margin-right: 0.75rem;
  margin-bottom: 0.5rem;
}

.image {
  margin-top: 8rem;
}

.description {
  font-size: 1.2rem;
}

.culture_skills {
  background-color: #e7ffe8;
}

.governance_values {
  background-color: #aac2fa60;
}

.methods_processes {
  background-color: #ffe6ab60;
}

.communication_involvement {
  background-color: #fa89b880;
}
</style>
