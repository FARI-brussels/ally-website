<template>
  <component
    :is="url ? 'a' : 'div'"
    :href="url"
    class="card"
    rel="noopener noreferrer"
  >
    <img v-if="image" :src="image" class="card-image" alt="Card image">
    <div class="card-content">
      <span
        v-if="category"
        class="card-category"
        :style="color ? { color } : {}"
        >{{ category.replace(/-/g, " & ") }}</span
      >
      <div class="card-title-row">
        <h2 class="card-title">{{ title }}</h2>
        <img
          src="/assets/icons/arrow-right-new.svg"
          class="card-arrow"
          alt="Go to details"
        >
      </div>
      <p class="card-description color-gray-light-mode-600">
        {{ description }}
      </p>
    </div>
  </component>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  image?: string;
  url?: string;
  category?: string;
  color?: string;
}>();
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "sass:map";

.card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
  width: 320px;
  &:hover {
    transform: scale(1.03);
  }
}
.card-image {
  width: 100%;
  height: 180px;
  border-radius: 1rem;
  object-fit: cover;
}
.card-content {
  padding-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.card-category {
  font-size: 0.85rem;
  color: map.get($colors, "brand-700");

  font-weight: 600;
  margin-bottom: 0.3rem;
}
.card-title-row {
  display: flex;
  align-items: start;
  gap: 0.5rem;
}
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.card-arrow {
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.5rem;
  display: inline-block;
  margin-top: 0.2rem;
}
</style>
