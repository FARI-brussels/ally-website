<template>
  <div class="card">
    <h2 class="title">{{ title }}</h2>
    <div class="item">
      <img src="~/assets/icons/clock-icon-black.svg" />
      {{ time }}
    </div>
    <div class="item">
      <img src="~/assets/icons/money-icon-black.svg" />
      {{ cost }}
    </div>
    <div class="item">
      <img src="~/assets/icons/thunder-icon-black.svg" />
      {{ effort }}
    </div>
    <div class="item">
      <img src="~/assets/icons/thunder-icon-black.svg" />
      {{ involvement }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RequirementCardProps } from "~/types/components/Card";

const props = defineProps<RequirementCardProps>();

const localeTitle = {
  en: "What do you need?",
  fr: "De quoi avez-vous besoin?",
  nl: "Wat heb je nodig?",
};

const localeTime = {
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

const localeEffort = {
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

const localeCost = {
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

const title = computed(() => localeTitle[props.locale]);

const time = computed(() => localeTime?.[props.time]?.[props.locale]);

const effort = computed(() => localeEffort?.[props.effort]?.[props.locale]);

const cost = computed(() => localeCost?.[props.cost]?.[props.locale]);

const involvement = computed(() => props.involvement);
// const involvement = computed(() => localeInvolvement?.[props.involvement]?.[props.locale])
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/typography" as *;
@use "sass:color";

.card {
  width: 24rem;
  height: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  color: $text-color;
  background-color: rgba($light-blue, 0.6);
  border-radius: 1rem;
  padding: 1.25rem;
  cursor: default;
  border: 2px solid $light-blue;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.item {
  display: flex;
  align-items: center;
  font-weight: $text-medium-bold;
  gap: 1rem;
}

img {
  max-width: 2rem;
}
</style>
