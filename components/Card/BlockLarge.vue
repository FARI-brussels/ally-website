<template>
  <component
    :is="url ? 'a' : 'div'"
    :href="url"
    class="card"
    rel="noopener noreferrer"
    :class="{ 'is-link': url, 'is-not-link': !url, 'has-requirements': !!time }"
  >
    <img 
      v-if="image" 
      :src="image" 
      class="card-image" 
      alt="Card image"
    >
    <div class="card-content">
      <span
        v-if="category"
        class="card-category"
        :style="color ? { color } : {}"
        >{{ category.replace(/-/g, " & ") }}</span
      >
      <div class="card-title-row">
        <h2 class="card-title">{{ title }}</h2>
        <img
          v-if="url"
          :src="ArrowRight"
          class="card-arrow"
          alt="Go to details"
        >
      </div>
      <p class="card-description color-gray-light-mode-600">
        {{ description }}
      </p>
    </div>

    <div v-if="time" class="requirements-section">
      <h3 class="requirements-title">{{ requirementsTitle }}</h3>

      <div class="item">
        <span class="icon-container bg-color-gray-light-mode-50">
          <img src="/assets/icons/clock-icon-black.svg" class="icon-svg">
        </span>
        {{ timeRequirement }}
      </div>
      <div class="item">
        <span class="icon-container bg-color-gray-light-mode-50">
          <img src="/assets/icons/money-icon-black.svg" class="icon-svg">
        </span>
        {{ costRequirement }}
      </div>
      <div class="item">
        <span class="icon-container bg-color-gray-light-mode-50">
          <img src="/assets/icons/thunder-icon-black.svg" class="icon-svg">
        </span>
        {{ effortRequirement }}
      </div>

      <div v-if="involvement" class="item involvement-item">
        <div class="involvement-label">{{ involvementLabel }}</div>
        <span class="chip-list">
          <span
            v-for="chip in involvementChips"
            :key="chip"
            class="chip bg-color-gray-light-mode-50 border-color-gray-light-mode-500 color-gray-light-mode-500"
          >
            {{ chip }}
          </span>
        </span>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import ArrowRight from "~/assets/icons/arrow-right.svg";
import type { Locale } from '~/types/Locale'

type Level = "low" | "medium" | "high";
type LocaleMap = Record<Locale, string>;
type LevelMap = Record<Level, LocaleMap>;

const props = defineProps<{
  title: string;
  description: string;
  image?: string;
  url?: string;
  category?: string;
  color?: string;

  locale?: Locale;
  time?: Level;
  cost?: Level;
  effort?: Level;
  involvement?: string;
}>();

const localeTitleMap: LocaleMap = {
  en: "What do you need?",
  fr: "De quoi avez-vous besoin?",
  nl: "Wat heb je nodig?",
};

const localeTimeMap: LevelMap = {
  low: {
    en: "low time consumption",
    fr: "faible consommation de temps",
    nl: "laag tijdsverbruik",
  },
  medium: {
    en: "medium time consumption",
    fr: "consommation de temps moyenne",
    nl: "gemiddelde tijdsconsumptie",
  },
  high: {
    en: "high time consumption",
    fr: "consommation de temps élevée",
    nl: "hoge tijdsbesteding",
  },
};

const localeEffortMap: LevelMap = {
  low: {
    en: "low effort",
    fr: "faible effort",
    nl: "weinig moeite",
  },
  medium: {
    en: "medium effort",
    fr: "effort moyen",
    nl: "gemiddelde inspanning",
  },
  high: {
    en: "high effort",
    fr: "effort élevé",
    nl: "veel moeite",
  },
};

const localeCostMap: LevelMap = {
  low: {
    en: "low cost",
    fr: "faible coût",
    nl: "lage kosten",
  },
  medium: {
    en: "medium cost",
    nl: "gemiddelde kosten",
    fr: "coût moyen",
  },
  high: {
    en: "high cost",
    nl: "hoge kosten",
    fr: "coût élevé",
  },
};

const involvementLabelMap: LocaleMap = {
  en: "Who's involved:",
  fr: "Qui est impliqué:",
  nl: "Wie is betrokken:",
};

function getLocaleString(map: LocaleMap, locale: Locale): string {
  return map[locale] ?? "";
}

function getLevelLocaleString(
  map: LevelMap,
  level: Level,
  locale: Locale,
): string {
  return map[level]?.[locale] ?? "";
}

const activeLocale = computed(() => props.locale || "en");

const requirementsTitle = computed(() =>
  getLocaleString(localeTitleMap, activeLocale.value),
);
const timeRequirement = computed(() =>
  props.time
    ? getLevelLocaleString(localeTimeMap, props.time, activeLocale.value)
    : "",
);
const effortRequirement = computed(() =>
  props.effort
    ? getLevelLocaleString(localeEffortMap, props.effort, activeLocale.value)
    : "",
);
const costRequirement = computed(() =>
  props.cost
    ? getLevelLocaleString(localeCostMap, props.cost, activeLocale.value)
    : "",
);
const involvementLabel = computed(() =>
  getLocaleString(involvementLabelMap, activeLocale.value),
);
const involvementChips = computed(() =>
  props.involvement
    ? props.involvement
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [],
);
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/typography" as *;
@use "sass:map";
@use "sass:color";

.card {
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  width: 320px;
  cursor: pointer;

  &.is-link {
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.01);
    }
  }
}

.card-image {
  width: 100%;
  height: 180px;
  border-radius: 1rem;
  object-fit: cover;
}
.card-content {
  padding-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.card-category {
  font-size: 0.85rem;
  color: map.get($colors, "brand-700");
  font-weight: 600;
  margin-top: 1rem;
}
.card-title-row {
  display: flex;
  align-items: start;
  gap: 0.5rem;
}
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.card-arrow {
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.5rem;
  display: inline-block;
  margin-top: 0.2rem;
}

.requirements-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
}

.requirements-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.icon-svg {
  width: 1rem;
  height: 1rem;
  display: block;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  border: 1px solid map.get($colors, "gray-light-mode-300");
  color: map.get($colors, "gray-light-mode-500");
  border-radius: 1rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.95rem;
  font-weight: $text-medium-bold;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
}

.involvement-item {
  align-items: flex-start;
  flex-direction: column;
}

.involvement-label {
  font-size: 1rem;
  font-weight: $text-medium;
  margin-bottom: 0.5rem;
  color: map.get($colors, "gray-light-mode-500");
}
</style>
