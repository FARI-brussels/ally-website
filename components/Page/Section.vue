<template>
  <section :class="{ section: true, ['section--white']: onDark }">
    <h2 class="color-gray-light-mode-900">{{ props.title }}</h2>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="props.description && props.html" v-html="safeHtml" />
    <div v-if="props.description && !props.html">
      <p>{{ props.description }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SectionProps } from "@/types/components";
import { marked } from "marked";

const props = defineProps<SectionProps>();

const renderer = new marked.Renderer();

renderer.link = ({ href, title, text }) => {
  if (href && href.startsWith("javascript:")) return `<a>${text}</a>`;
  
  const titleAttr = title ? ` title="${title}"` : "";
  return `<br> <br> <a href="${href}"${titleAttr} class="fake-ally-btn">${text}</a>`;
};

const safeHtml = computed(() => {
  const rawHtml = marked(props.description, { renderer });

  return sanitizeHtml(rawHtml as string); //should be fixed
});

function sanitizeHtml(unsafeHtml: string) {
  let sanitizedHtml = unsafeHtml.replace(
    /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
    "",
  );
  sanitizedHtml = sanitizedHtml.replace(
    /\s*(on\w+|href)\s*=\s*(['"])javascript:[\s\S]*?\2/gi,
    "",
  );

  return sanitizedHtml;
}

</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/typography" as *;
@use "sass:map";

.section {
  color: $text-color;
  &--white {
    color: white;
  }
}

h2 {
  font-size: 2.2rem;
  font-weight: $text-bold;
  margin-bottom: 1rem;
}

div {
  font-size: 1.2rem;
}
</style>

<style lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/typography" as *;
@use "sass:map";

.fake-ally-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #684688;
  color: white;
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s,
    border 0.15s;
  text-decoration: none;

  &:hover {
    background-color: #8e6dac;
  }
}
</style>
