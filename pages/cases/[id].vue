<template>
  <main class="main">
    <Suspense>
      <HeroDesktop
        dense
        :title="selectedCase?.title[locale]"
        :description="selectedCase?.description[locale]"
      />
    </Suspense>
    <Suspense>
      <div class="page-items">
        <div class="sections">
          <PageSection
            :title="selectedCase?.title[locale]"
            :description="selectedCase?.content[locale]"
          />
        </div>
        <div
          v-if="
            selectedCase?.building_blocks_used &&
            selectedCase?.building_blocks_used?.length
          "
          class="sidebar"
        >
          <h2 class="alternatives-title">{{ alterativesTitle[locale] }}</h2>

          <Suspense>
            <CardDesktop
              v-for="block in selectedCase?.building_blocks_used"
              :key="block.id"
              :title="block.title[locale]"
              :description="block.description[locale]"
              :categories="[block.category?.title[locale]]"
              :url="block.id"
              @click="navigateTo(`/building-blocks/${block.id}`)"
            />
          </Suspense>
        </div>
      </div>
    </Suspense>
    <Suspense>
      <div class="links">
        <!-- <CardLink 
              v-for="link in selectedCase?.external_links" 
              :key="link.id"
              :title="link.title[locale]"
              :description="link.description[locale]"
              :url="link.id"
              @click="navigateTo(`/building-blocks/${link.id}`)"
        /> -->
      </div>
    </Suspense>

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
const { locale, banner } = storeToRefs(useGlobalStore());
const { selectedCase } = storeToRefs(useCasesStore());
const { findCase } = useCasesStore();
const route = useRoute();

onMounted(async () => await findCase(route.params.id));

onMounted(() => console.log(selectedCase.value));
const alterativesTitle = {
  en: "Building blocks used in this case",
  nl: "Bouwstenen die in dit geval zijn gebruikt",
  fr: "Blocs de construction utilisés dans ce cas",
};
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;

.page-items {
  display: flex;
  margin: 2rem 0;
  justify-content: space-between;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 50%;
}

.requirements {
  min-width: 20%;
}

.banner,
.links {
  margin-bottom: 2rem;
}

.sidebar {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2rem;
}

.alternatives-title {
  align-self: center;
  font-weight: bold;
}
</style>
