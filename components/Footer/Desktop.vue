<template>
  <div class="wrapper">
    <div class="content">
      <div class="footer-main">
        <img class="logo ally-logo" src="/assets/logos/logo_ALLY_white.svg" >
        <p class="footer-description">
          ALLY is a comprehensive guide designed to help organisations create an
          actionable strategy for responsible AI.
        </p>
        <NavbarDesktop :items="$props.items" dark small class="navbar" />
      </div>

      <div class="logos">
        <img src="/assets/logos/FARI_logo_white.png" class="logo" >
        <img src="/assets/logos/ULB_VUB_white.png" class="logo" >
        <img src="/assets/logos/Logo_KDM_EN_wit 2.png" class="logo" >
        <img src="/assets/logos/AI_Flanders_logo.png" class="logo" >
        <img src="/assets/logos/EU.svg" class="logo" >
      </div>
    </div>

    <hr class="footer-divider" >
    <p class="copyright">&copy; 2025 ALLY. All rights reserved.</p>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from "~/types/shared";
import type { Routes } from "~/types/components/Routes";
defineProps<{ items?: Routes; locale?: Locale }>();
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
}

.footer-main {
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: baseline;
  gap: 2rem;
  padding-right: 6rem;
}

.footer-description {
  color: map.get(colors.$colors, "brand-200");
  font-weight: $text-medium;
}

.logos {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-left: auto;
  justify-content: space-between;
  padding: 1rem;
  width: 30%;
}

.logo {
  height: 2.5rem;
  width: auto;
}

.ally-logo {
  height: 4rem;
}

.navbar {
  justify-content: start;
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
