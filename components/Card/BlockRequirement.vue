<template>
  <div class="card">
    <h2 class="title">{{ title }}</h2>
    <div class="item">
      <span class="icon-container bg-color-gray-light-mode-50">
        <img src="~/assets/icons/clock-icon-black.svg" class="icon-svg" >
      </span>
      {{ time }}
    </div>
    <div class="item">
      <span class="icon-container bg-color-gray-light-mode-50">
        <img src="~/assets/icons/money-icon-black.svg" class="icon-svg" >
      </span>
      {{ cost }}
    </div>
    <div class="item">
      <span class="icon-container bg-color-gray-light-mode-50">
        <img src="~/assets/icons/thunder-icon-black.svg" class="icon-svg" >
      </span>
      {{ effort }}
    </div>
    
    <div class="item involvement-item">
      <div class="involvement-label">{{ involvementLabel }}</div>
      <span class="chip-list">
        <span v-for="chip in involvementChips" :key="chip" class="chip bg-color-gray-light-mode-50 border-color-gray-light-mode-500 color-gray-light-mode-500">
          {{ chip }}
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RequirementCardProps } from "~/types/components/Card";
import type { Locale, LocaleMap, LevelMap } from '~/types/Locale';
import { computed } from 'vue';

const props = defineProps<RequirementCardProps>();

const localeTitle: LocaleMap = {
  en: "What do you need?",
  fr: "De quoi avez-vous besoin?",
  nl: "Wat heb je nodig?",
};

const localeTime: LevelMap = {
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

const localeEffort: LevelMap = {
  low: {
    en: "low effort",
    fr: "faible effort",
    nl: "weinig moeite",
  },
  medium: {
    en: "low effort",
    fr: "effort moyen",
    nl: "gemiddelde inspanning",
  },
  high: {
    en: "high effort",
    fr: "effort élevé",
    nl: "veel moeite",
  },
};

const localeCost: LevelMap = {
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



const title = computed(() => getLocaleString(localeTitle, props.locale));
const time = computed(() => getLevelLocaleString(localeTime, props.time, props.locale));
const effort = computed(() => getLevelLocaleString(localeEffort, props.effort, props.locale));
const cost = computed(() => getLevelLocaleString(localeCost, props.cost, props.locale));
const involvementLabel = computed(() => getLocaleString(involvementLabelMap, props.locale));
const involvementChips = computed(() =>
  props.involvement
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
);


function getLocaleString(map: LocaleMap, locale: Locale): string {
  return map[locale] ?? '';
}

function getLevelLocaleString(map: LevelMap, level: string, locale: Locale): string {
  return map[level]?.[locale] ?? '';
}

</script>

<style scoped lang="scss">
@use "/assets/scss/colors";
@use "/assets/scss/typography" as *;
@use "sass:color";
@use "sass:map";

.card {
  width: 24rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  border-radius: 1rem;
  padding: 2rem;
  cursor: default;
  border: 1px solid map.get(colors.$colors, 'gray-light-mode-200');
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
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
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.icon-svg {
  width: 1.5rem;
  height: 1.5rem;
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
  border: 1px solid map.get(colors.$colors, 'gray-light-mode-300');
  color: map.get(colors.$colors, 'gray-light-mode-500');
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
  color: map.get(colors.$colors, 'gray-light-mode-500');
}
</style>
