<template>
  <div class="wrapper wrapper-mobile">
    <div class='content'>
    <div class="footer-main">
      <img class="logo ally-logo" src="/assets/logos/logo_ALLY_white.svg" >
      <p class="footer-description">ALLY helps you turn AI principles into concrete action, guiding your organisation toward transparency, accountability, and trust.</p>
      <NavbarDesktop :items="$props.items" dark small class="navbar"/>

    </div>

    <div class="logos">
      <img src="/assets/logos/FARI_logo_white.png" class="logo">
      <img src="/assets/logos/ULB_VUB_white.png" class="logo" >
      <img src="/assets/logos/Logo_KDM_EN_wit 2.png" class="logo">
      <img src="/assets/logos/AI_Flanders_logo.png" class="logo">
      <img src="/assets/logos/EU.svg" class="logo">
    </div>
  </div>
    <hr class="footer-divider" >
    <p class="copyright">&copy; 2025 ALLY. All rights reserved. </p>
  </div>
</template>

<script setup lang="ts">
  import type { Locale } from "~/types/Locale";
  defineProps<{ items?: unknown[]; locale?: Locale }>();

</script>

<style scoped lang="scss">
@use "~/assets/scss/colors";
@use "~/assets/scss/typography" as *;
@use "sass:map";

.wrapper {
  padding: 2rem 4rem;
}

.content {
  display: flex;
  flex-direction: column;
}

.footer-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.footer-description {
  color: map.get(colors.$colors, "brand-200");
  font-weight: $text-medium;
}

.logos {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.logo {
  height: 2.5rem;
  width: auto;
}

.ally-logo {
  height: 4rem;
}

.navbar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 2rem
}


.footer-divider {
  border: none;
  border-top: 1px solid map.get(colors.$colors, "brand-600");
  margin: 3rem 0;
  width: 100%;
}

.copyright {
  color: map.get(colors.$colors, "brand-200");
}
</style>
