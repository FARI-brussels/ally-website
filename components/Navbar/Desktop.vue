<template>
  <nav :class="{ dark: $props.dark, small: $props.small }">
    <NuxtLink v-for="{ name, path, label } in items" :key="path" :to="path">
      {{ label || name }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  items?: { name?: string; path?: string; label?: string }[];
  dark?: boolean;
  small?: boolean;
}>();
</script>

<style scoped lang="scss">
@use "/assets/scss/colors";
@use "sass:color";
@use "sass:map";

nav {
  width: 100%;
  font-size: 1.4rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: colors.$text-color;
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
      color: colors.$deep-purple;
      background-color: transparent;
    }
  }
}

.dark {
  color: map.get(colors.$colors, "brand-200");
  a {
    &:hover {
      color: white;
    }
  }
}

.small {
  font-size: 1rem;
}
</style>
