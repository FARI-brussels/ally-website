<template>
  <div class="main">
    <div class="filter-container">
      <div
        v-if="pageData && !isMobile"
        class="color-gray-light-mode-900 page-section-wrapper"
      >
        <strong class="color-brand-700"> Cases </strong>
        <h1 class="color-gray-light-mode-900 title">
          Responsible AI in action
        </h1>
        <span class="color-gray-light-mode-500 description">
          {{ pageData.content[0] }}
        </span>
      </div>
      <div v-else-if="isMobile" class="color-gray-light-mode-900">
        <strong class="color-brand-700"> Cases </strong>
        <h1 class="color-gray-light-mode-900 title">
          See responsible AI in action
        </h1>
        <span class="color-gray-light-mode-500 description">
          {{ pageData?.content[0] }}
        </span>
      </div>
    </div>

    <div class="filter-container">
      <template v-if="isMobile">
        <FormDropDown
          v-model="selectedCategoryOptions"
          :options="categoryOptions"
          placeholder="Filter by category"
        />
      </template>
      <template v-else>
        <div
          class="filter-item color-gray-light-mode-700"
          :class="{ 'all-selected': filters.length === categories.length }"
          @click="() => toggleFilterItem(null)"
        >
          <span class="color-brand-700">
            {{
              filters.length === categories.length
                ? "Deselect all"
                : "Select all"
            }}</span
          >
        </div>
        <transition-group
          name="filter-pop"
          tag="div"
          class="filter-items-group"
        >
          <div
            v-for="category in categories"
            :key="category.label"
            class="filter-item color-gray-light-mode-700"
            :class="[
              { selected: filters.includes(category.value) },
              category.className,
            ]"
            @click="() => toggleFilterItem(category.value)"
          >
            {{ category.label }}
          </div>
        </transition-group>
      </template>
    </div>

    <div class="content-wrapper">
      <transition-group name="card-pop" tag="div" class="content-wrapper">
        <CardMain
          v-for="block in filteredBlocks"
          :key="block.id"
          category="Case study"
          :title="block.title[locale]"
          :description="block.description[locale]"
          @click="navigateTo(`/cases/${block.id}`)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import type { Case } from "~/types/directus/Case";
import type { DirectusBuildingBlock } from "~/types/directus/BuildingBlock";
import FormDropDown from "~/components/Form/DropDown.vue";
import { useIsMobile } from "~/composables/useIsMobile";
import type { OptionProps } from "~/types/components/Dropdown";

const { locale } = storeToRefs(useGlobalStore());
const { pages } = storeToRefs(useStaticPageStore());
const { getStaticPage } = useStaticPageStore();
const { cases } = storeToRefs(useCasesStore()) as { cases: Ref<Case[]> };
const { getCases } = useCasesStore();
const { getBuildingBlockCategories } = useGlobalStore();
const { isMobile } = useIsMobile();

onMounted(
  async () =>
    await Promise.all([
      getBuildingBlockCategories(),
      getCases(),
      getStaticPage("cases"),
    ]),
);

const pageData = computed(() => {
  if (!pages.value.cases) return null;

  const title = pages.value.cases?.title[locale.value];
  const content = pages.value.cases?.content?.map((c) => c[locale.value]);

  return {
    title,
    content,
  };
});

const categories = [
  {
    label: "Values & structures",
    value: "values-structures",
    className: "cat-values",
  },
  {
    label: "Culture & skills",
    value: "culture-skills",
    className: "cat-culture",
  },
  {
    label: "Communication & participation",
    value: "communication-participation",
    className: "cat-communication",
  },
  {
    label: "Methods & processes",
    value: "methods-processes",
    className: "cat-methods",
  },
];

const filters = ref<string[]>([...categories.map((c) => c.value)]);

const categoryOptions: OptionProps[] = categories.map((c) => ({
  label: c.label,
  value: c.value,
}));
const selectedCategoryOptions = computed<OptionProps[]>({
  get() {
    return categoryOptions.filter((opt) =>
      filters.value.includes(opt.value as string),
    );
  },
  set(opts: OptionProps[]) {
    filters.value = opts.map((opt) => opt.value as string);
  },
});

function toggleFilterItem(category: string | null) {
  if (category === null) {
    if (filters.value.length === categories.length) {
      filters.value = [];
    } else {
      filters.value = [...categories.map((c) => c.value)];
    }
    return;
  }
  const index = filters.value.indexOf(category);
  if (index > -1) filters.value.splice(index, 1);
  else filters.value.push(category);
}

const filteredBlocks = computed(() => {
  if (!cases.value) return [];
  if (filters.value.length === categories.length) return cases.value;

  return cases.value.filter((item: Case) => {
    const slugs = new Set<string>();
    if (item.building_blocks_used?.category?.slug) {
      slugs.add(item.building_blocks_used.category.slug.trim());
    }
    if (Array.isArray(item.building_blocks_used?.alternative_building_blocks)) {
      (
        item.building_blocks_used
          .alternative_building_blocks as DirectusBuildingBlock[]
      ).forEach((alt: DirectusBuildingBlock) => {
        if (alt.category?.slug) slugs.add(alt.category.slug.trim());
      });
    }
    return [...slugs].some((slug) => filters.value.includes(slug));
  });
});
</script>

<style scoped lang="scss">
@use "/assets/scss/colors";
@use "sass:map";

.main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.title {
  font-size: 3rem;
  font-weight: 700;
}

.description {
  font-size: 1.2rem;
  font-weight: 500;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;

  .filter-item {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    margin-right: 0.5rem;
    cursor: pointer;
    border: 4px solid transparent;
    width: fit-content;
    transition:
      border-color 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      background 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      color 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    font-weight: 500;
  }

  .filter-item.selected {
    transform: scale(1.08);
    z-index: 1;
    color: map-get(colors.$colors, "brand-700");
    background-color: map-get(colors.$colors, "brand-100");
  }

  .all-selected {
    background-color: map.get(colors.$colors, "brand-200");
  }
}

.page-section-wrapper {
  width: 40%;
  min-width: 350px;
  max-width: 700px;
  margin-bottom: 2rem;
}

@media (min-width: 1200px) {
  .page-section-wrapper {
    width: 66%;
  }
}

.filter-item.cat-values:hover {
  border-color: rgba(map.get(colors.$colors, "values-structures"), 0.3);
}
.filter-item.cat-culture:hover {
  border-color: rgba(map.get(colors.$colors, "culture-skills"), 0.3);
}
.filter-item.cat-communication:hover {
  border-color: rgba(
    map.get(colors.$colors, "communication-participation"),
    0.3
  );
}
.filter-item.cat-methods:hover {
  border-color: rgba(map.get(colors.$colors, "methods-processes"), 0.3);
}

.content-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  margin-bottom: 2rem;
}

.filter-items-group {
  display: flex;
  gap: 1.3rem;
}

.filter-pop-enter-active,
.filter-pop-leave-active {
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.filter-pop-enter-from {
  opacity: 0;
  transform: scale(0.7) translateY(20px) rotate(-8deg);
}
.filter-pop-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0) rotate(0);
}
.filter-pop-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0) rotate(0);
}
.filter-pop-leave-to {
  opacity: 0;
  transform: scale(0.7) translateY(-20px) rotate(8deg);
}

.card-pop-enter-active,
.card-pop-leave-active {
  transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;
}
.card-pop-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(40px) rotate(-3deg);
}
.card-pop-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0) rotate(0);
}
.card-pop-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0) rotate(0);
}
.card-pop-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(-40px) rotate(3deg);
}
</style>
