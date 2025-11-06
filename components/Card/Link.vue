<template>
  <a
    :href="props.url"
    target="_blank"
    rel="noopener noreferrer"
    class="card-link"
  >
    <div class="card hoverable">
      <h2 class="title">{{ props.title }}</h2>
      <p class="description">{{ truncatedDescription }}</p>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { CardProps } from "~/types/components/index";

const props = defineProps<CardProps>();

const truncatedDescription = computed(() => {
  if (!props.description) return "";

  const maxLength = 100;
  return props.description.length > maxLength
    ? props.description.slice(0, maxLength) + "..."
    : props.description;
});
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "sass:color";
a {
  min-width: 24rem;
  max-width: 50%;
}
.card {
  height: 100%;
  color: $text-color;
  background-color: white;
  border-radius: 0.315rem;
  padding: 1.25rem;
  cursor: pointer;
  border: 1px solid $light-blue;
}

.hoverable {
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    -webkit-box-shadow: 0px 0px 2.5rem -26px
      color.scale($text-color, $alpha: -0.8%);
    -moz-box-shadow: 0px 0px 2.5rem -26px
      color.scale($text-color, $alpha: -0.8%);
    box-shadow: 0px 0px 2.5rem -26px color.scale($text-color, $alpha: -0.8%);
  }
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

.description {
  font-size: 1.2rem;
}
</style>
