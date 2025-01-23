<template>
  <section :class="{ section: true, ['section--white']: onDark }">
    <h2>{{ props.title }}</h2>
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
  // Ignore JavaScript URLs
  if (href && href.startsWith("javascript:")) {
    return `<a>${text}</a>`;
  }
  const titleAttr = title ? ` title="${title}"` : "";
  return `<a href="${href}"${titleAttr}>${text}</a>`;
};

const safeHtml = computed(() => {
  const rawHtml = marked(props.description, { renderer });
  return sanitizeHtml(rawHtml);
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

.section {
  color: $text-color;
  &--white {
    color: white;
  }
}

h2 {
  font-size: 2rem;
  font-weight: $text-bold;
}

div {
  font-size: 1.3rem;
}
</style>
