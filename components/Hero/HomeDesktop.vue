<template>
  <div 
    class="wrapper" 
    :style="{ 
      backgroundImage: `url(${$props?.media})`, 
      backgroundSize: 'contain', 
      backgroundRepeat: 'no-repeat',
      backgroundPositionY: 'bottom'
    }">
<div class="content">
 <h1 class="color-base-white title"> {{ $props?.title }}</h1>
 <p class="color-base-white description">{{ $props?.description }}</p>
 <div class="actions">
   <template v-if="$props?.primary_action">
     <a :href="$props.primary_action.url" class="btn btn-primary">{{ $props.primary_action.label }}</a>
   </template>
   <template v-if="$props?.secondary_action">
     <a :href="$props.secondary_action.url" class="btn btn-secondary">{{ $props.secondary_action.label }}</a>
   </template>
 </div>
</div>
  </div>
</template>

<script setup lang="ts">
import type { HeroProps } from "@/types/components";

defineProps<HeroProps>();
</script>

<style scoped lang="scss">
@use "/assets/scss/colors";
@use 'sass:map';

.wrapper {
  position: relative;
  display: flex;

  justify-content: center;
  align-items: center;
  height: 40rem;
  border-radius: 1.25rem;
}
.title {
  margin: 0 auto;
  font-size: 3rem;
}
.content {
  border-radius: 1.25rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 2rem;
  background: linear-gradient(
    to bottom,
    map.get(colors.$colors, "brand-800") 0%,
    map.get(colors.$colors, "brand-800") 50%,
    transparent 100%
  );
}
.actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 1rem;
}
.description {
  margin: 1rem auto 0 auto;
  font-size: 1.25rem;
  text-align: center;
  max-width: 40rem;
}
.btn {
  padding: 0.75rem 2rem;
  border-radius: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.btn-primary {
  background: map.get(colors.$colors, "brand-600");
  color: map.get(colors.$colors, "base-white");
  border: none;
}
.btn-primary:hover {
  background: map.get(colors.$colors, "brand-700");
}
.btn-secondary {
  background: transparent;
  color: map.get(colors.$colors, "base-white");
  border: 2px solid map.get(colors.$colors, "base-white");
}
.btn-secondary:hover {
  background: map.get(colors.$colors, "base-white");
  color: map.get(colors.$colors, "brand-800");
}

@media (max-width: 900px) {
  .wrapper {
    border-radius: 0;
    height: 24rem;
  }
  .content {
    border-radius: 0;
    padding-top: 1rem;
  }
  .title {
    font-size: 1.8rem;
  }
  .description {
    font-size: 1rem;
    max-width: 90vw;
  }
  .btn {
    font-size: 0.55rem;
    padding: 0.5rem 1rem;
  }
}
</style>
