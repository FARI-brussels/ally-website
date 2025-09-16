<template>
  <nav>
    <NuxtLink v-for="{ name, path, label } in items" :key="path" :to="path">     {{ label || name }}</NuxtLink>
  </nav>
</template>

<script setup lang="ts">
defineProps<{ items?: unknown[] }>();
</script>

<style scoped lang="scss">
@use "~/assets/scss/colors" as *;
@use "sass:color";

nav {
  width: 100%;

  line-height: 24px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
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
    margin-bottom: 1.5rem;
    font-weight: 600;
    font-size: 1rem;
    &:hover {
      color: $deep-purple;
      background-color: transparent;
    }
  }
}
</style>
