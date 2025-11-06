<template>
  <transition-group
    name="block-pop"
    tag="div"
    class="block-list"
    :class="{ mobile: isMobile }"
  >
    <template
      v-for="{
        title,
        description,
        category,
        cost,
        effort,
        time,
        involvement,
        maintenance,
        id,
      } in blocks"
      :key="id"
    >
      <CardMain
        v-if="!$props.expanded"
        v-bind="{
          id,
          title,
          description,
          category,
        }"
        :image="getImage(category)"
        :url="`/building-blocks/${id}`"
        :color="categoryColors[category]"
      />

      <CardBlockLarge
        v-else
        class="unified-card-spacing"
        v-bind="{
          id,
          title,
          description,
          category,
          effort,
          cost,
          involvement,
          maintenance,
          time,
        }"
        :image="getImage(category)"
        :url="`/building-blocks/${id}`"
        :color="categoryColors[category]"
        locale="en"
      />
    </template>
  </transition-group>
</template>

<script setup lang="ts">
import CardMain from "~/components/Card/Main.vue";
import { categoryColors } from "~/utils/categoryColors";
import type { Block } from "~/types/components";
import type { CategorySlug } from "~/types/shared";

defineProps<{ blocks: Block[]; expanded?: boolean }>();

const imageQueues: Record<string, number[]> = {};

function getNextImageIndex(category: string, totalImages = 4): number {
  if (!imageQueues[category] || imageQueues[category].length === 0) {
    imageQueues[category] = Array.from(
      { length: totalImages },
      (_, i) => i + 1,
    ).sort(() => Math.random() - 0.5);
  }

  const idx = imageQueues[category].shift()!;
  imageQueues[category].push(idx);
  return idx;
}

function getImage(category: CategorySlug) {
  if (!category) return "";
  const index = getNextImageIndex(category);
  return `/blocks/${category}-${index}.png`;
}

const { isMobile } = useIsMobile();
</script>

<style scoped>
.block-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 3rem;
}

.mobile {
  flex-direction: column;
  align-items: center;
}

.block-pop-enter-active,
.block-pop-leave-active {
  transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;
}
.block-pop-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(40px) rotate(-3deg);
}
.block-pop-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0) rotate(0);
}
.block-pop-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0) rotate(0);
}
.block-pop-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(-40px) rotate(3deg);
}
</style>
