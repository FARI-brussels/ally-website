<template>
  <div class="wrapper" :class="{ 'wrapper-dense': $props.dense }">


    <div class="content">
      <div v-if="$props.media" class="media-container">
        <img :src="$props.media" alt="hero image" class="hero-image" />
      </div>
      <CardGlass v-bind="$props" class="textcontent"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeroProps } from "@/types/components";

defineProps<HeroProps>();
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;

.wrapper {
  position: relative;
  display: flex;

  height: 40rem;
  &-dense {
    height: unset;
  }
}


.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  // width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background-color: $deep-purple;
  border-radius: 1.25rem;
  // img {
  //   width: 100%;
  //   height: 100%;
  //   border-radius: 1.25rem;
  // }
}


.content {
  display: flex;
  flex-direction: column;
  z-index: 3;
  width: 100%;
  position: relative;

  .textcontent {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}

.hero-image {
  // object-fit: none;
  object-fit: cover;
  width: 100%;
  border-radius: 1.25rem;
}

// .media-container {
//   margin: auto;
//   width: 100%;
//   height: 100%;
// }
</style>
