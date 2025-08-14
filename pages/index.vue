<template>
  <div class="main">
    <HeroHomeDesktop v-bind="heroProps" :class="isMobile ? 'hero full-width-section' : 'hero'" />

    <div class="info-section" :class="{ 'info-section-mobile': isMobile }">
      <PageSection
        v-if="pageData.content.length"
        html
        title=" "
        :description="pageData.content[0]"
        class="info-title"
        :class="{ 'info-title-mobile': isMobile }"
      />

      <AllyButton
        append-icon="arrow-right"
        variant="primary"
        class="info-action"
        :block="isMobile"
        :label="CTALabel[locale] ?? CTALabel.en"
        @click="navigateTo('/building-blocks')"
      />
    </div>

    <div class="building-blocks-section"> 
      <BlockList :blocks="buildingBlocks" />
    </div>

    <div class="categories-section bg-color-gray-light-mode-50 full-width-section" :class="{ 'categories-section-mobile': isMobile }">
      <PageSection
        v-if="pageData.content.length > 1"
        html
        title=" "
        :description="pageData.content[1]"
        class="categories-title"
        :class="{ 'categories-title-mobile': isMobile }"
      />
      <div class="categories-list" :class="{ 'categories-list-mobile': isMobile }">
        <div 
          v-for="card in blockData" 
          :key="card.title" 
          class="card"
          :class="{
            'card-mobile': isMobile,
          }"
          >
          <div :class="`category-${card.slug}`" class="category-color" />
          <h2 class="title">{{ card.title }}</h2>
          <p class="description">{{ card.description }}</p>
        </div>
      </div>
    </div>

    <div class="cases-section">
      <div class="cases-introduction" :class="{ 'cases-introduction-mobile': isMobile }">
        <PageSection
          title="Learn from other organisations"
          class="cases-title"
          :class="{ 'cases-title-mobile': isMobile }"
          description="Get inspired by case studies of other organisations. Learn about their governance strategy, the actions they took, and the challenges they encountered and overcame in working on trustworthy AI. "
        />
        <AllyButton
          append-icon="arrow-right"
          variant="primary"
          class="action"
          :block="isMobile"
          label="discover all cases"
          @click="navigateTo('/cases')"
        />
      </div>
      <div class="case-preview" :class="{ 'case-preview-mobile': isMobile }">
        <CardMain
          v-for="{ id, title, description } in cases.slice(0, 3)"
          :key="id"
          category="Case Study"
          :title="title[locale]"
          :description="description[locale]"
          :url="`/cases/${id}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BlockList from '~/components/BlockList.vue';
import { mapCategory } from '~/utils/mapCategory';
import { isCategorySlug } from '~/utils/category';
import type { HeroProps } from '~/types/components/Hero';
import type { HomePageContent } from '~/types/parsers/Page';
import type { Category, Block, PagesStore } from '~/types/components';

const { getBuildingBlockCategories } = useGlobalStore();
const { getStaticPage } = useStaticPageStore();
const { locale, buildingBlockCategories } = storeToRefs(useGlobalStore());
const { pages } = storeToRefs(useStaticPageStore());
const { cases } = storeToRefs(useCasesStore());
const { getCases } = useCasesStore();
const { blocks } = storeToRefs(useBuildingBlockStore());
const { getBlocks } = useBuildingBlockStore();


const { isMobile } = useIsMobile();

onMounted(async () => {
  await Promise.all([
    getBuildingBlockCategories(), 
    getCases(), 
    getBlocks(),
    getStaticPage("home")
  ]);
});

const pageData = computed((): { title: string; content: string[]; hero: HeroProps } => {
  const home = (pages.value as PagesStore).home;
  const fallback: HeroProps = { title: '', description: '', media: '' };
  if (!home) return { title: '', content: [], hero: fallback };
  return {
    title: home.title?.[locale.value] ?? '',
    content: Array.isArray(home.content)
      ? home.content.map((c: HomePageContent) => c?.[locale.value] ?? '')
      : [],
    hero: {
      media: home.hero?.media ?? '',
      title: home.hero?.title?.[locale.value] ?? '',
      description: home.hero?.description?.[locale.value] ?? '',
    },
  };
});

const heroProps = computed((): HeroProps => pageData.value.hero);

const blockData = computed((): { title: string; description: string; slug: string }[] => {
  if (!buildingBlockCategories.value) return [];
  return (buildingBlockCategories.value as Category[]).map((cat) => {
    const mappedSlug = isCategorySlug(cat.slug) ? cat.slug : 'governance_values';
    return {
      title: cat.title?.[locale.value] ?? '',
      description: cat.description?.[locale.value] ?? '',
      slug: mapCategory(mappedSlug),
    };
  });
});

const CTALabel: Record<string, string> = {
  fr: "découvrir tous les blocs de construction",
  en: "discover all building blocks",
  nl: "ontdek alle bouwstenen",
};

const buildingBlocks = computed((): Array<{ id: number; title: string; description: string; category: string; categoryTitle?: string; url: number }> => {
  if (!blocks.value || !blocks.value.length) return [];
  const mapped = (blocks.value as Block[]).map((block) => {
    const mappedSlug = isCategorySlug(block.category?.slug) ? block.category?.slug : 'governance_values';
    return {
      id: block.id,
      title: block.title?.[locale.value] ?? '',
      description: block.description?.[locale.value] ?? '',
      category: mapCategory(mappedSlug),
      categoryTitle: block.category?.title?.[locale.value],
      url: block.id, 
    };
  });

  const shuffled = mapped.sort(() => Math.random() - 0.5);
  const uniqueByCategory: Record<string, typeof mapped[0]> = {};
  for (const block of shuffled) {
    if (
      block.category &&
      !uniqueByCategory[block.category] &&
      Object.keys(uniqueByCategory).length < 3
    ) {
      uniqueByCategory[block.category] = block;
    }
    if (Object.keys(uniqueByCategory).length === 3) break;
  }
  return Object.values(uniqueByCategory);
});
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;

.action {
  margin-top: 1rem;
  gap: 1rem;
}

.info-section {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: start;
  
  .info-title {
     width: 60%; 
  }
  .info-action-mobile { 
    width: 100%; 
    display: block; 
  }

}
.info-section-mobile {
  flex-direction: column;
  align-items: stretch;
  .info-title, .info-title-mobile { width: 100%; margin-bottom: 1rem; }
  .info-action-mobile { width: 100%; display: block; margin-top: 1rem; }
  .info-action-desktop { 
    width: 100%; 
  }
}

.building-blocks-section { margin: $desktop-padding 0; }

.full-width-section {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.categories-section {
  padding: $desktop-padding;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  .categories-title { width: 28%; min-width: 250px; }
  .categories-list { width: 70%; display: flex; flex-wrap: wrap; gap: 1rem;
    .card { flex: 1 1 calc(50% - 1rem); max-width: calc(50% - 1rem); min-width: 250px; }
  }
  .category-color { width: 4.8rem; height: 3.3rem; border-radius: .4rem; }
}
.categories-section-mobile {
  flex-direction: column;
  .categories-title, .categories-title-mobile, .categories-list, .categories-list-mobile { width: 100%; }
  .card, .card-mobile { flex-basis: 100%; max-width: 100%; }
  .card-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .categories-list-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
  .categories-title-mobile {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
}

.case-preview { display: flex; gap: 2rem; flex-wrap: wrap; }
.case-preview-mobile { 
  flex-direction: column; 
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}
.cases-section { display: flex; flex-direction: column; margin: 2rem 0; gap: 1rem; }
.cases-introduction { display: flex; justify-content: space-between; align-items: start; .cases-title { width: 60%; } }
.cases-introduction-mobile { flex-direction: column; .cases-title, .cases-title-mobile { width: 100%; } }
</style>
