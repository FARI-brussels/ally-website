<template>
  <transition-group
    name="block-pop"
    tag="div"
    class="block-list"
    :class="{ mobile: isMobile }"
  >
    <template v-for="block in blocks" :key="block.id">
      <CardMain
        v-if="!$props.expanded"
        :title="typeof block.title === 'string' ? block.title : ''"
        :description="
          typeof block.description === 'string' ? block.description : ''
        "
        :image="
          getImage(typeof block.category === 'string' ? block.category : '')
        "
        :url="`/building-blocks/${block.id}`"
        :category="typeof block.category === 'string' ? block.category : ''"
        :color="
          categoryColors[
            typeof block.category === 'string' ? block.category : ''
          ]
        "
      />

      <CardBlockLarge
        v-else
        class="unified-card-spacing"
        :title="typeof block.title === 'string' ? block.title : ''"
        :description="
          typeof block.description === 'string' ? block.description : ''
        "
        :image="
          getImage(typeof block.category === 'string' ? block.category : '')
        "
        :url="`/building-blocks/${block.id}`"
        :category="typeof block.category === 'string' ? block.category : ''"
        :color="
          categoryColors[
            typeof block.category === 'string' ? block.category : ''
          ]
        "
        locale="en"
        :cost="block.cost as 'low' | 'medium' | 'high' | undefined"
        :effort="block.effort as 'low' | 'medium' | 'high' | undefined"
        :involvement="block.involvement || ''"
        :time="block.time as 'low' | 'medium' | 'high' | undefined"
      />
    </template>
  </transition-group>
</template>

<script setup lang="ts">
import CardMain from "~/components/Card/Main.vue";
import { categoryColors } from "~/utils/categoryColors";
import type { Block } from "~/types/components";

defineProps<{ blocks: Block[]; expanded?: boolean }>();

const imageQueues: Record<string, number[]> = {};

function getNextImageIndex(category: string, totalImages = 4): number {
  if (!imageQueues[category] || imageQueues[category].length === 0) {
    // Initialize and shuffle the queue for this category
    imageQueues[category] = Array.from(
      { length: totalImages },
      (_, i) => i + 1,
    ).sort(() => Math.random() - 0.5);
  }
  // Pop the first index and push it to the end
  const idx = imageQueues[category].shift()!;
  imageQueues[category].push(idx);
  return idx;
}

function getImage(category: string) {
  console.log({ category });
  if (!category) return "";
  const index = getNextImageIndex(category);
  console.log(`/blocks/${category}-${index}.png`);
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
