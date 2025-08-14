<template>
  <div class="wrapper">
    <div class="header">
      <NuxtLink :to="'/'">
        <img class="logo" src="~/assets/logos/logo_ALLY_new.svg" >
      </NuxtLink>

      <NavbarDesktop class="navbar" :items="$props.items" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from "~/types/Locale";
defineProps<{ items?: unknown[]; locale: Locale }>();

</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;
.wrapper {
  display: flex;
  flex-direction: column;
  position: relative;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0;

    .logo {
      height: 3rem;
    }
  }

  .navbar {
    padding: 2.5rem 0;
  }
}
</style>
