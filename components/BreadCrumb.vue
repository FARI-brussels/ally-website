<!-- components/BreadcrumbLabel.vue -->
<template>
  <span class="breadcrumb-label" :class="`category-color-${validColorKey}`">
    <span >{{ categoryText }}</span>
    <span class="separator">•</span>
    <span>{{ labelText }}</span>
  </span>
</template>

<script setup lang="ts">
const validColorKeys = [
  'values-structures',
  'culture-skills',
  'communication-participation',
  'methods-processes'
] as const

type ColorKey = (typeof validColorKeys)[number]

const props = defineProps<{
  categoryText: string
  labelText: string
  colorKey?: string
}>()

const validColorKey = validColorKeys.includes(props.colorKey as ColorKey)
  ? props.colorKey
  : 'brand-700'
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'sass:color';
@use '@/assets/scss/colors' as *;

.breadcrumb-label {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  font-size: 1rem;
  gap: 0.4em;
}

.separator {
  margin: 0 0.25em;
}

@each $slug, $color in (
  'values-structures': map.get($colors, 'values-structures'),
  'culture-skills': map.get($colors, 'culture-skills'),
  'communication-participation': map.get($colors, 'communication-participation'),
  'methods-processes': map.get($colors, 'methods-processes'),
  'brand-700': map.get($colors, 'brand-500') // fallback
) {
  .category-color-#{$slug} {
    color: color.scale($color, $lightness: -40%);
  }
}
</style>
