<template>
  <nav>
    <NuxtLink v-for="{ name, path, label } in items" :key="path" :to="path">
      {{ label || name }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ items?: { name?: string; path?: string; label?: string }[] }>();

console.log(props.items);
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "sass:color";

nav {
  width: 100%;
  font-size: 1.4rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: $text-color;
  white-space: nowrap;

  a.router-link-exact-active {
    font-weight: bold;
  }

  a.router-link-exact-active:hover {
    background-color: transparent;
  }

  a {
    display: inline-block;
    margin-right: 2.875rem;
    &:hover {
      color: $deep-purple;
      background-color: transparent;
    }
  }
}
</style>
