<template>
  <div class="search-bar-wrapper">
    <input
      v-model="model"
      type="text"
      :placeholder="placeholder"
      class="search-input"
      @keydown.enter="handleSubmit"
    >
    <img src="/assets/icons/search.svg" alt="search" class="search-icon" >
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>();
const placeholder = ref<string>("Search for a block");

const emit = defineEmits<{
  (e: "submit", value: string): void;
}>();

const handleSubmit = () => model.value && emit("submit", model.value);
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
.search-bar-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}
.search-input {
  flex: 1;
  padding: 8px 8px 8px 2.5rem; 
  border-radius: 0.5rem;
  border: 1px solid $border-color;
  height: 3rem;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px map-get($colors, "brand-600");
  border-color: map-get($colors, "brand-600");
}
.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  pointer-events: none;
}
</style>
