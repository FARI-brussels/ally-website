<template>
  <div class="wrapper">
    <div class="header">
      <img class="logo" src="~/assets/logos/logo_ALLY_new.svg">
      <img
        src="@/assets/icons/menu.svg"
        alt="menu-button"
        @click="() => toggleMenu()"
      >

      <div class="menu" :class="{ visible: isMenuOpen }">
        <div class="menu-title">
          <NuxtLink :to="'/'">
            <img class="logo" src="~/assets/logos/logo_ALLY_new.svg">
          </NuxtLink>
          <img
            src="@/assets/icons/close-button.svg"
            class="close-button"
            alt="close-button"
            @click="() => toggleMenu()"
          >
        </div>

        <NavbarMobile
          class="navbar"
          :items="$props.items"
          @click="() => toggleMenu()"
        />
        <!-- <AllyButton
          variant="primary"
          prepend-icon="scan"
          label="do the quickscan"
          @click="$router.push('/quickscan')"
        /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from "~/types/shared";
import type { Routes } from "~/types/components/Routes";
defineProps<{ items?: Routes; locale: Locale }>();

const [isMenuOpen, toggleMenu] = useToggle(false);
</script>

<style scoped lang="scss">
@use "~/assets/scss/colors" as *;
@use "~/assets/scss/spacing" as *;

.logo {
  height: 3rem;
}

.wrapper {
  display: flex;
  flex-direction: column;
  position: relative;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    position: sticky;
    top: 0;

    .title {
      margin-right: auto;
      color: $medium-purple;
      text-transform: uppercase;
    }
  }

  .menu {
    display: flex;
    flex-direction: column;
    background-color: white;
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh;
    background: white;
    transition: right 0.3s ease;
    z-index: 9999;
    padding: 2rem;
    transition: right 0.3s ease;
    -webkit-box-shadow: 10px 0px 35px -14px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 10px 0px 35px -14px rgba(0, 0, 0, 0.4);
    box-shadow: 10px 0px 35px -14px rgba(0, 0, 0, 0.4);

    &-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      .title {
        color: $medium-purple;
        text-transform: uppercase;
      }
      .close-button {
        cursor: pointer;
        margin-left: auto;
      }
    }
  }

  .visible {
    right: 0;
  }

  .navbar {
    padding: 2.5rem 0;
  }
}
</style>
