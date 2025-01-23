<template>
  <main class="main">
    <div class="hero-container">
      <PageSection
        html
        on-dark
        :title="selectedCase?.title[locale]"
        :description="selectedCase?.description[locale]"
      />
    </div>

    <div class="page-items">
      <PageSection
        title=" "
        html
        :description="selectedCase?.content[locale]"
      />

      <div class="links">
        <CardLink
          v-for="link in selectedCase?.external_links"
          :key="link.id"
          :title="link.title[locale]"
          :description="link.description[locale]"
          :url="link.id"
          @click="navigateTo(`/building-blocks/${link.id}`)"
        />
      </div>
    </div>

    <div v-if="selectedCase?.building_blocks_used" class="sidebar">
      <div class="sidebar-inner">
        <h2 class="alternatives-title">{{ alterativesTitle[locale] }}</h2>

        <CardDesktop
          :key="selectedCase?.building_blocks_used.id"
          :title="selectedCase?.building_blocks_used.title[locale]"
          :description="selectedCase?.building_blocks_used.description[locale]"
          :categories="[
            {
              label: selectedCase?.building_blocks_used.category?.title[locale],
              value: selectedCase?.building_blocks_used.category?.slug,
            },
          ]"
          :url="selectedCase?.building_blocks_used.id"
          @click="
            navigateTo(
              `/building-blocks/${selectedCase?.building_blocks_used.id}`,
            )
          "
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
const { selectedCase } = storeToRefs(useCasesStore());
const { findCase } = useCasesStore();
const route = useRoute();

onMounted(async () => await findCase(route.params.id));

const alterativesTitle = {
  en: "Building blocks used in this case",
  nl: "Bouwstenen die in dit geval zijn gebruikt",
  fr: "Blocs de construction utilisés dans ce cas",
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

.alternatives-title {
  align-self: flex-start;
  font-weight: bold;
}

.banner {
  grid-column-start: 1;
  grid-column-end: 5;
}
</style>
