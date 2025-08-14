<template>
  <div ref="dropdown" class="language-dropdown" @click="toggleDropdown">
    <button
      class="dropdown-button"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <img alt="icon" src="/assets/icons/language-icon.svg" class="icon" >

      {{ props.locale?.split("-").pop() }}
    </button>
    <ul v-if="isOpen" class="dropdown-menu" role="listbox">
      <li
        v-for="{ label, value } in locales"
        :key="value"
        role="option"
        :aria-selected="value === props.locale ? 'true' : 'false'"
        @click="selectLocale(value)"
      >
        {{ label }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
// import { onClickOutside } from '@vueuse/core'
import type { Locale, LocaleObject } from "@/types/Locale";

interface Props {
  locales: LocaleObject[];
  locale: Locale;
}

const props = withDefaults(defineProps<Props>(), {
  locales: () => [
    { label: "EN", value: "en" },
    { label: "FR", value: "fr" },
    { label: "NL", value: "nl" },
  ],
  locale: "en",
});
const emit = defineEmits<{ (e: "change", locale: Locale): void }>();

const isOpen = ref(false);

const toggleDropdown = () => (isOpen.value = !isOpen.value);

const selectLocale = (locale: Locale) => {
  if (locale !== props.locale) emit("change", locale);

  isOpen.value = false;
};

const closeDropdown = () => (isOpen.value = false);

const dropdown = ref<HTMLDivElement | null>(null);
onClickOutside(dropdown, closeDropdown);

onMounted(() => document.addEventListener("keydown", handleKeydown));

onUnmounted(() => document.removeEventListener("keydown", handleKeydown));

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeDropdown();
  }
};
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/typography" as *;
@use "sass:color";

.language-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  cursor: pointer;
  padding: 0.5rem;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: $medium-purple;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  img {
    margin-right: 0.5rem;
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border-radius: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0.5rem;
  width: 100%;
  z-index: 1000;
  -webkit-box-shadow: 0px 0px 2.5rem -22px color.scale($text-color, $alpha: -0.85%);
  -moz-box-shadow: 0px 0px 2.5rem -22px color.scale($text-color, $alpha: -0.85%);
  box-shadow: 0px 0px 2.5rem -22px color.scale($text-color, $alpha: -0.85%);
  li {
    padding: 0.5rem;
    cursor: pointer;
    width: 100%;
    white-space: nowrap;
    text-transform: uppercase;
    font-weight: $text-medium-bold;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
  }
}

.dropdown-menu li[aria-selected="true"] {
  color: $medium-purple;
}

.dropdown-menu li:hover {
  background-color: lighten($medium-purple, 50%);
}
</style>
