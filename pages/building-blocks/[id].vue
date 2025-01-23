<template>
  <main class="main">
    <div class="hero-container">
      <PageSection
        html
        on-dark
        :title="selectedBlock?.title[locale] || ''"
        :description="selectedBlock?.description[locale] || ''"
        :categories="[selectedBlock?.category.title[locale]]"
      />
    </div>

    <div class="page-items">
      <PageSection
        html
        :title="benefitsTitle[locale] || ''"
        :description="selectedBlock?.benefits[locale] || ''"
      />
      <PageSection
        html
        :title="howToExecuteTitle[locale] || ''"
        :description="selectedBlock?.how_to_execute[locale] || ''"
      />
      <PageSection
        html
        :title="kpisTitle[locale] || ''"
        :description="selectedBlock?.kpis[locale] || ''"
      />

      <PageSection
        :title="externalLinksTitle[locale]"
        :description="externalLinksParagraph[locale] || ''"
      />

      <div class="links">
        <CardLink
          v-for="link in selectedBlock?.external_links"
          :key="link.id"
          :title="link.title[locale]"
          :description="link.description?.[locale]"
          :url="link.url"
          class="link"
        />
      </div>
    </div>

    <div class="sidebar">
      <div class="sidebar-inner">
        <CardBlockRequirement
          class="requirements"
          :locale="locale"
          :cost="selectedBlock?.cost || ''"
          :effort="selectedBlock?.effort || ''"
          :involvement="selectedBlock?.involvement || ''"
          :time="selectedBlock?.time || ''"
          :maintenance="selectedBlock?.maintenance || ''"
        />

        <h2
          v-if="selectedBlock?.alternative_building_blocks.length"
          class="alternatives-title"
        >
          {{ alterativesTitle[locale] }}
        </h2>

        <CardDesktop
          v-for="block in selectedBlock?.alternative_building_blocks"
          :key="block.id"
          :title="block.title[locale]"
          :description="block.description[locale]"
          :categories="[
            {
              label: block.category?.title[locale],
              value: block.category?.slug,
            },
          ]"
          :url="block.id"
          class="link"
          @click="navigateTo(`/building-blocks/${block.id}`)"
        />
      </div>
    </div>

    <!-- <BannerDesktop
        v-if="banner"
        class="banner"
        :title="banner.title[locale]"
        :description="banner.description[locale]"
        :link-description="banner.action.label[locale]"
        :url="banner.action.url"
      /> -->
  </main>
</template>
<script setup lang="ts">
const { locale } = storeToRefs(useGlobalStore());
const { selectedBlock } = storeToRefs(useBuildingBlockStore());
const { findBlock } = useBuildingBlockStore();
const route = useRoute();

onMounted(async () => await findBlock(route.params.id));

const alterativesTitle = {
  en: "Alternative building blocks",
  nl: "Alternatieve bouwstenen",
  fr: "Blocs de construction alternatifs",
};

const benefitsTitle = {
  en: "How does this building block help?",
  nl: "Hoe helpt deze bouwsteen?",
  fr: "Comment ce bloc de construction aide-t-il ?",
};

const howToExecuteTitle = {
  en: "How can you execute this building block?",
  nl: "Hoe kun je deze bouwsteen uitvoeren?",
  fr: "Comment pouvez-vous exécuter ce bloc de construction ?",
};

const kpisTitle = {
  en: "What KPI’s can you set for yourself?",
  nl: "Welke KPI’s kunt u voor uzelf instellen?",
  fr: "Quels indicateurs clés de performance pouvez-vous définir pour vous-même ?",
};

const externalLinksTitle = {
  en: "What supporting materials are available?",
  nl: "Welke ondersteunende materialen zijn beschikbaar?",
  fr: "Quels supports sont disponibles ?",
};

const externalLinksParagraph = {
  en: "Explore these supporting materials to enhance your understanding and gain comprehensive insights into the topic at hand.",
  nl: "Verken deze ondersteunende materialen om uw begrip te vergroten en uitgebreid inzicht te krijgen in het onderwerp.",
  fr: "Explorez ces documents de soutien pour améliorer votre compréhension et obtenir des informations complètes sur le sujet traité.",
};
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;

.main {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.hero-container {
  background-color: $deep-purple;
  border-radius: 0.8rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 20rem;
  grid-column-start: 1;
  grid-column-end: 5;
  gap: 2rem;
}

.page-items {
  grid-column-start: 1;
  grid-column-end: 4;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar {
  grid-column-start: 4;
  grid-column-end: 5;

  &-inner {
    float: right;
    display: flex;
    width: min-content;
    align-items: flex-end;
    flex-direction: column;
    gap: 2rem;
  }
}

.banner {
  grid-column-start: 1;
  grid-column-end: 5;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.alternatives-title {
  align-self: flex-start;
  font-weight: bold;
}
</style>
