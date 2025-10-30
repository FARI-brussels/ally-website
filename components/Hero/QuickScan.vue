<template>
  <div class="wrapper">
    <div class="content">
      <p class="heading color-brand-800">{{ $props.heading }}</p>
      <h1 class="color-base-black title">{{ $props?.title }}</h1>
      <p class="color-base-black description">{{ $props?.description }}</p>
      <div class="actions">
        <AllyButton
          :prepend-icon="copied ? 'check' : 'copy-link'"
          label="Copy your unique link"
          @click="copyLink"
        />
      </div>
    </div>
    <img class="bg-image" src="/images/Section.png" >
  </div>
</template>

<script setup lang="ts">
import type { HeroProps } from "@/types/components";

defineProps<HeroProps & { heading: string }>();

const copied = ref(false);
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
</script>

<style scoped lang="scss">
@use "/assets/scss/colors";
@use "/assets/scss/typography";
@use "sass:map";

.wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 40rem;
  border-radius: 1.25rem;
  background: linear-gradient(180deg, #faf7fd 0%, #efe9f5 100%);
}

.bg-image {
  position: absolute;
  z-index: 0;
  width: 50%;
  height: auto;
  right: 0;
  bottom: 0;
  border-radius: 1.25rem;
}
.content {
  z-index: 1;
  border-radius: 1.25rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 50%;
  height: 100%;
  padding: 4rem;
}
.actions {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.heading {
  margin: 1rem 0;
  font-weight: typography.$text-medium-bold;
}

.title {
  margin: 0 auto;
  font-size: 3rem;
}

.description {
  margin: 1rem auto 0 auto;
  font-size: 1.25rem;
  max-width: 40rem;
}

@media (max-width: 900px) {
  .wrapper {
    border-radius: 0;
    overflow: hidden;
  }

  .bg-image {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: auto;
    right: 0;
    bottom: -2rem;
    border-radius: 0;
  }
  .content {
    border-radius: 0;
    padding-top: 1rem;
    width: 100%;
    text-align: center;
  }
  .title {
    font-size: 3rem;
  }
  .description {
    font-size: 1rem;
    max-width: 90vw;
  }
}
</style>
