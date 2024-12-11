<template>
  <main class="main">
    <div class="search-container">
      <div v-if="pageData" class="search-container__text-content">
        <PageSection html onDark :title="pageData.title" :description="pageData.content[0]"/>
      </div>
    </div>

    <div class="chips">
      <ChipItem
        v-for="{ label, value } in categories"
        :key="value"
        :label="label"
        :class="filters.includes(value) ? 'selected' : ''"
        @click="() => toggleFilterItem(value)"
      />
    </div>

    <div class="content-wrapper">
      <CardDesktop
        v-for="block in filteredBlocks"
        :key="block.id"
        :title="block.title[locale]"
        :description="block.description[locale]"
        :url="block.id"
        @click="navigateTo(`/cases/${block.id}`)"
      />

      <CardDesktop
        v-if="!filteredBlocks.length"
        title="Not found"
        description="Try another search filter"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
const { locale } = storeToRefs(useGlobalStore());
const { pages } = storeToRefs(useStaticPageStore());
const { getStaticPage } = useStaticPageStore();
const { cases } = storeToRefs(useCasesStore());
const { getCases } = useCasesStore();
const { getBuildingBlockCategories } = useGlobalStore();

onMounted(
  async () =>
    await Promise.all([
      getBuildingBlockCategories(),
      getCases(),
      getStaticPage("cases"),
    ]),
);

const pageData = computed(() => {
  if (!pages.value.cases)return null

  const title = pages.value.cases?.title[locale.value];
  const content = pages.value.cases?.content?.map(c => c[locale.value])

  return {
    title,
    content,
  };
});


const filteredBlocks = computed(() => {
  if (!cases.value) return [];

  if (!filters.value.length) return cases.value;

const c = cases.value.filter(item => filters.value.includes(item.building_blocks_used?.category.slug))

  return c

});

function toggleFilterItem(category: string) {
  const index = filters.value.indexOf(category);

  if (index > -1) filters.value.splice(index, 1);
  else filters.value.push(category);
}
const filters = ref<string[]>([]);

const categories = [
  { label: "Governance & values", value: "governance_values" },
  { label: "Culture & skills", value: "culture_skills" },
  { label: "Communication & involvement", value: "communication_involvement" },
  { label: "Methods & processes", value: "methods_processes " },
];
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;
@use "sass:color";

.search-container {
  background-color: $deep-purple;
  border-radius: 0.8rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem 10rem;
  height: 100%;
  margin-bottom: 4rem;

  &__text-content {
    display: flex;
    flex-direction: column;
    gap: 1 rem;
    margin-bottom: 2rem;
  }

  &__title {
    color: white;
    text-align: center;
    font-size: 2.2rem;
    font-weight: 700;
  }
  &__description {
    color: white;
    text-align: center;
    font-size: 1.3rem;
  }
}

.chips {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.chip {
  cursor: pointer;
  transition: all 200ms ease;
}

.selected {
  color: white;
  background-color: color.adjust($medium-purple, $alpha: -0.15);
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 2rem;
  gap: 3rem;
}

.categories-overview {
  margin-top: 1rem;
  flex: 50%;
}

.content-wrapper > *:first-child {
  flex: 1;
}

.content-wrapper > *:nth-child(2) {
  flex: 2;
}

.card {
  height: 16rem;
  color: $text-color;
  background-color: white;
  margin-bottom: 1rem;
  .title {
    font-weight: bold;
  }
}
</style>
