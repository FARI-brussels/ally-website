<template>
  <main class="main">
    <div class="search-container">
      <div v-if="pageData" class="search-container__text-content">
        <PageSection
          html
          on-dark
          :title="pageData.title || ''"
          :description="pageData.content[0] || ''"
        />
      </div>

      <div class="search-filter">
        <div class="search-bar">
          <FormSearchBar v-model="searchTerm" />
        </div>

        <div class="dropdowns">
          <FormDropDown
            v-model="selectedCategory"
            :options="categories"
            placeholder="Category"
          />
          <FormDropDown
            v-model="selectedCost"
            :options="cost"
            placeholder="Cost"
          />
          <FormDropDown
            v-model="selectedDifficulty"
            :options="difficulty"
            placeholder="Difficulty"
          />
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <template
        v-if="
          !selectedCategory.value ||
          selectedCategory.value === 'governance_values'
        "
      >
        <PageSection v-bind="governanceSection" />
        <div class="card-container">
          <CardDesktop
            v-for="block in governanceBlocks"
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
            @click="navigateTo(`/building-blocks/${block.id}`)"
          />
          <CardDesktop
            v-if="!governanceBlocks.length"
            title="Not found"
            color="secondary"
            description="Try another search filter"
          />
        </div>
      </template>

      <template
        v-if="
          !selectedCategory.value || selectedCategory.value === 'culture_skills'
        "
      >
        <PageSection v-if="cultureSection" v-bind="cultureSection" />
        <div class="card-container">
          <CardDesktop
            v-for="block in cultureBlocks"
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
            color="primary"
            @click="navigateTo(`/building-blocks/${block.id}`)"
          />
          <CardDesktop
            v-if="!cultureBlocks.length"
            title="Not found"
            color="secondary"
            description="Try another search filter"
          />
        </div>
      </template>

      <template
        v-if="
          !selectedCategory.value ||
          selectedCategory.value === 'communication_involvement'
        "
      >
        <PageSection
          v-if="communicationSection"
          v-bind="communicationSection"
        />
        <div class="card-container">
          <CardDesktop
            v-for="block in communicationBlocks"
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
            color="primary"
            @click="navigateTo(`/building-blocks/${block.id}`)"
          />
          <CardDesktop
            v-if="!communicationBlocks.length"
            title="Not found"
            color="secondary"
            description="Try another search filter"
          />
        </div>
      </template>

      <PageSection v-if="methodsSection" v-bind="methodsSection" />
      <div class="card-container">
        <CardDesktop
          v-for="block in methodsBlocks"
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
          color="primary"
          @click="navigateTo(`/building-blocks/${block.id}`)"
        />

        <CardDesktop
          v-if="!methodsBlocks.length"
          title="Not found"
          color="secondary"
          description="Try another search filter"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const { locale, buildingBlockCategories } = storeToRefs(useGlobalStore());
const { pages } = storeToRefs(useStaticPageStore());
const { getStaticPage } = useStaticPageStore();
const { blocks } = storeToRefs(useBuildingBlockStore());
const { getBlocks } = useBuildingBlockStore();
const { getBuildingBlockCategories } = useGlobalStore();

onMounted(
  async () =>
    await Promise.all([
      getBuildingBlockCategories(),
      getBlocks(),
      getStaticPage("blocks"),
    ]),
);

const pageData = computed(() => {
  if (!pages.value.blocks) return null;

  const title = pages.value.blocks?.title[locale.value];
  const content = pages.value.blocks?.content?.map((c) => c[locale.value]);

  return {
    title,
    content,
  };
});

const filteredBlocks = computed(() => {
  const blocksCopy = [...blocks.value];

  return filterBlocks({ searchTerm: searchTerm.value, blocks: blocksCopy });
});

const governanceSection = computed(() => {
  if (!buildingBlockCategories.value) return;
  const section = buildingBlockCategories.value?.find(
    ({ slug }) => slug === "governance_values",
  );
  return {
    title: section?.title[locale.value],
    description: section?.description[locale.value],
  };
});

const governanceBlocks = computed(() => {
  if (!filteredBlocks.value) return [];

  return filteredBlocks.value
    .filter(({ category }) => category?.slug === "governance_values")
    .filter((block) => {
      if (!selectedDifficulty.value || !selectedDifficulty.value.value)
        return true;
      return selectedDifficulty.value?.value === block.effort;
    })
    .filter((block) => {
      if (!selectedCost.value || !selectedCost.value.value) return true;
      return selectedCost.value?.value === block.cost;
    });
});

const cultureSection = computed(() => {
  if (!buildingBlockCategories.value) return;
  const section = buildingBlockCategories.value?.find(
    ({ slug }: { slug: string }) => slug === "culture_skills",
  );
  return {
    title: section?.title[locale.value],
    description: section?.description[locale.value],
  };
});

const cultureBlocks = computed(() => {
  if (!filteredBlocks.value) return [];

  return filteredBlocks.value
    .filter(({ category }) => category?.slug === "culture_skills")
    .filter((block) => {
      if (!selectedDifficulty.value || !selectedDifficulty.value.value)
        return true;
      return selectedDifficulty.value?.value === block.effort;
    })
    .filter((block) => {
      if (!selectedCost.value || !selectedCost.value.value) return true;
      return selectedCost.value?.value === block.cost;
    });
});

const communicationSection = computed(() => {
  if (!buildingBlockCategories.value) return;
  const section = buildingBlockCategories.value?.find(
    ({ slug }) => slug === "communication_involvement",
  );
  return {
    title: section?.title[locale.value],
    description: section?.description[locale.value],
  };
});

const communicationBlocks = computed(() => {
  if (!filteredBlocks.value) return [];

  return filteredBlocks.value
    .filter(({ category }) => category?.slug === "communication_involvement")
    .filter((block) => {
      if (!selectedDifficulty.value || !selectedDifficulty.value.value)
        return true;
      return selectedDifficulty.value?.value === block.effort;
    })
    .filter((block) => {
      if (!selectedCost.value || !selectedCost.value.value) return true;
      return selectedCost.value?.value === block.cost;
    });
});

const methodsSection = computed(() => {
  if (!buildingBlockCategories.value) return;
  const section = buildingBlockCategories.value?.find(
    ({ slug }) => slug === "methods_processes",
  );
  return {
    title: section?.title[locale.value],
    description: section?.description[locale.value],
  };
});

const methodsBlocks = computed(() => {
  if (!filteredBlocks.value) return [];

  return filteredBlocks.value
    .filter(({ category }) => category?.slug === "methods_processes")
    .filter((block) => {
      if (!selectedDifficulty.value || !selectedDifficulty.value.value)
        return true;
      return selectedDifficulty.value?.value === block.effort;
    })
    .filter((block) => {
      if (!selectedCost.value || !selectedCost.value.value) return true;
      return selectedCost.value?.value === block.cost;
    });
});

const searchTerm = ref<string>("");

const categories = [
  { label: "Category", value: null },
  { label: "Values & structures", value: "governance_values" },
  { label: "Culture & skills", value: "culture_skills" },
  { label: "Communication & participation", value: "communication_involvement" },
  { label: "Methods & processes", value: "methods_processes " },
];

const cost = [
  { label: "Cost", value: null },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const difficulty = [
  { label: "Difficulty", value: null },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const selectedCategory = ref(categories[0]);
const selectedCost = ref(cost[0]);
const selectedDifficulty = ref(difficulty[0]);

function filterBlocks({ blocks, searchTerm }) {
  if (!searchTerm || !searchTerm.length) return blocks;

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  function searchInObject(obj) {
    for (const key in obj) {
      if (obj[key]) {
        const value = obj[key];

        if (typeof value === "string") {
          if (value.toLowerCase().includes(lowerCaseSearchTerm)) {
            return true;
          }
        } else if (typeof value === "object" && value !== null) {
          if (searchInObject(value)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  return blocks.filter((block) => searchInObject(block));
}
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;

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

.search-filter {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-bar {
  display: flex;
  gap: 8px;
  padding-bottom: 1rem;
  input {
    flex: 1;
    padding: 8px;
    border-radius: 0.5rem;
    border: none;
  }
}

.dropdowns {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
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

.categories-overview {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.card {
  height: 16rem;
  width: 36rem;
  color: $text-color;
  background-color: white;
  margin-bottom: 1rem;
  .title {
    font-weight: bold;
  }
}
</style>
