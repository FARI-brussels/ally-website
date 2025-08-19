<template>
  <div ref="dropdown" class="dropdown">
    <button @click="toggleDropdown">
      <span> {{ placeholder  }} </span>
      <img
        alt="icon"
        :src="ChevronDown"
        class="icon"
        :class="{ open: showDropdown }"
      >
    </button>
    <ul v-if="showDropdown" class="list">
      <li
        v-for="option in options"
        :key="option.value ?? option.label"
        class="list-item"
        @click.stop="toggleOption(option)"
      >
        <input
          type="checkbox"
          :checked="isSelected(option)"
          @change.prevent
        >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import type { OptionProps, OptionsList } from "@/types/components";
import ChevronDown from "~/assets/icons/chevron-down.svg";

const model = defineModel<OptionProps[]>({ default: () => [] });
defineProps<{ options: OptionsList; placeholder: string }>();

const dropdown = ref<HTMLElement | null>(null);
const showDropdown = ref<boolean>(false);
onClickOutside(dropdown, () => (showDropdown.value = false));
const toggleDropdown = () => (showDropdown.value = !showDropdown.value);

function isSelected(option: OptionProps) {
  return model.value.some((o) => o.value === option.value);
}

function toggleOption(option: OptionProps) {
  const idx = model.value.findIndex((o) => o.value === option.value);
  if (idx > -1) {
    model.value = [
      ...model.value.slice(0, idx),
      ...model.value.slice(idx + 1),
    ];
  } else {
    model.value = [...model.value, option];
  }
}
</script>

<style scoped lang="scss">
@use "assets/scss/colors";
@use "assets/scss/typography" as *;
@use "sass:color";
@use "sass:map";
.dropdown {
  position: relative;
  width: 100%;
}

.dropdown button {
  padding: 8px 16px;
  border-radius: 0.5rem;
  border: none;
  background: rgba(255, 255, 255, 0.41);
  font-family: Rajdhani;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
  border: 1px solid map.get(colors.$colors, "gray-light-mode-300");
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  width: 100%;
}

.list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  list-style: none;
  border-radius: 0.3125rem;
  padding: 0.3125rem;
  margin: 0;
  z-index: 10;
  min-width: fit-content;
  width: 100%;
  z-index: 1000;
  background-color: white;
  -webkit-box-shadow: 0px 0px 2.5rem -22px color.scale(colors.$text-color, $alpha: -0.85%);
  -moz-box-shadow: 0px 0px 2.5rem -22px color.scale(colors.$text-color, $alpha: -0.85%);
  box-shadow: 0px 0px 2.5rem -22px color.scale(colors.$text-color, $alpha: -0.85%);
}

.list-item {
  padding: 8px 16px;
  border-radius: 0.3125rem;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: color.adjust(map.get(colors.$colors, "brand-600"), $lightness: 50%);
  }

  & {
    background-color: white;
  }
}

.list-item input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 0.25em;
  background: white;
  cursor: pointer;
  position: relative;
  transition: background 0.2s, border-color 0.2s;
  margin-right: 0.5em;
}
.list-item input[type="checkbox"]:checked {
  background: map.get(colors.$colors, "brand-600");
  border-color: map.get(colors.$colors, "brand-600");
}
.list-item input[type="checkbox"]:checked::after {
    content: "";
    display: block;
    position: absolute;
    left: 0.35rem;
    top: 0.1rem;
    width: 0.4em;
    height: 0.7em;
    border: solid white;
    border-width: 0 0.18em 0.18em 0;
    transform: rotate(45deg);
}

.icon {
  margin-left: 0.3125rem;
  transition: all 100ms ease-in-out;
  width: 1.25rem;
}

.icon.open {
  rotate: 180deg;
}
</style>
