<template>
  <div class="wrapper">
    <div class="header">
      <NuxtLink :to="'/'">
        <img class="logo" src="~/assets/logos/logo_ALLY_new.svg" />
        <!-- <span class="title"> Ally - Ethical policy toolbox </span> -->
      </NuxtLink>
      <!-- <div class="logos">
        <img
          src="~/assets/logos/knowledge-center-logo.svg"
          class="knowledge-logo"
          alt="knowledge center logo"
        />
        <img
          src="~/assets/logos/FARI-logo.svg"
          class="fari-logo"
          alt="knowledge center logo"
        />
      </div> -->
      <!-- <LanguageSelector
        :locales="[
          { label: 'EN', value: 'en' },
          { label: 'FR', value: 'fr' },
          { label: 'NL', value: 'nl' },
        ]"
        :locale="locale"
        @change="(e: Locale) => $emit('change:locale', e)"
      /> -->
      <NavbarDesktop class="navbar" :items="$props.items" />
    </div>
    <!-- <hr class="divider" /> -->
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

    // .title {
    //   margin-right: auto;
    //   color: $medium-purple;
    //   text-transform: uppercase;
    // }
    .logo {
      height: 3rem;
      // margin-right: 2rem
    }
    // .logos {
    //   margin-right: 4.3rem;
    //   display: flex;
    //   align-items: center;
    //   .knowledge-logo {
    //     height: 2.6rem;
    //   }
    // }
  }

  // .divider {
  //   border: none;
  //   width: 100vw;
  //   position: absolute;
  //   top: rem;
  //   // top: 6rem;
  //   left: -$desktop-padding;
  //   border-top: 1px solid $border-color;
  //   margin-right: $desktop-padding;
  // }

  .navbar {
    padding: 2.5rem 0;
  }
}
</style>
