<template>
  <div class="banner">
    <div class="title-wrapper">
      <h2 class="title">{{ title }}</h2>
    </div>

    <div class="description">
      {{ description }}
      <!-- <RouterLink v-if="url && linkDescription" :to="url" v-slot="{ navigate }" class="cta-button">
        <SecondaryButton
          @click="navigate"
          :label="linkDescription"
          icon="arrow-right"
          role="link"
        />
      </RouterLink> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BannerProps } from "~/types/components";
defineProps<BannerProps>();
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/typography" as *;

.banner {
  display: flex;
  height: 20.3125rem;
  padding: 2.5rem;
  background: rgb(130, 70, 224);
  background: linear-gradient(
    90deg,
    rgba(130, 70, 224, 1) 0%,
    rgba(131, 39, 203, 1) 100%
  );
  border-radius: 0.625rem;
  color: white;

  .title-wrapper {
    width: 50%;
    height: 100%;
  }

  .title {
    font-size: $text-banner-title-size;
    font-weight: $text-bold;
    line-height: normal;
    margin-top: -1rem;
  }

  .description {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
    font-size: $text-banner-desc-size;
    font-weight: $text-medium-bold;
  }

  .cta-button {
    margin-top: auto;
  }
}
</style>
