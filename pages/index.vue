<template>
  <main class="main">
    <HeroDesktop v-bind="pageData.hero" />
    <div class="content-wrapper">
      <div class="info-section">
        <PageSection
          v-if="pageData.content?.length"
          html
          title=" "
          :description="pageData.content[0]"
        />
        <ButtonPrimary
          :label="CTALabel[locale]"
          icon="arrow-right"
          class="action"
          type="primary"
          @click="navigateTo('/building-blocks')"
        />
      </div>
      <div class="categories-overview">
        <PageSection
          v-if="pageData.content?.length"
          html
          title=" "
          :description="pageData.content[1]"
        />
        <div v-for="card in blockData" :key="card.title" class="card">
          <h2 class="title">{{ card.title }}</h2>
          <p class="description"> {{ card.description }}</p>
        </div>
      </div>
    </div>

    <div class="cases-wrapper">
      <PageSection
          v-if="pageData.content?.length"
          title="Learn from other organisations"
          description="Get inspired by case studies of other organisations. Learn about their governance strategy, the actions they took, and the challenges they encountered and overcame in working on trustworthy AI. "
        />
      <div class="case-preview">
      <CardDesktop
        v-for="{id, title, description} in cases.slice(0, 6)"
        :key="id"
        :title="title[locale]"
        :description="description[locale]"
        :url="id"
        @click="navigateTo(`/cases/${id}`)"
      />
    </div>
      <ButtonPrimary
          label="discover all cases"
          icon="arrow-right"
          class="action"
          type="primary"
          @click="navigateTo('/cases')"
        />
    </div>
    <!-- <BannerDesktop v-if="banner" v-bind="pageData.banner" /> -->
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  name: "home",
});

const { getBuildingBlockCategories } = useGlobalStore();
const { getStaticPage } = useStaticPageStore();
const { locale, buildingBlockCategories, banner } =
  storeToRefs(useGlobalStore());
const { pages } = storeToRefs(useStaticPageStore());

const { cases } = storeToRefs(useCasesStore());
const { getCases } = useCasesStore();

// onMounted(getBuildingBlockCategories);

onMounted(
  async () =>
    await Promise.all([
      getBuildingBlockCategories(),
      getCases(),
    ]),
);
onMounted(async () => getStaticPage("home"));

const pageData = computed(() => {
  if (!pages.value.home)
    return {
      title: null,
      content: null,
    };
    
  const title = pages.value.home?.title[locale.value];
  const content = pages.value.home?.content?.map(c => c[locale.value])

  const hero = {
    media: pages.value.home.hero?.media,
    title: pages.value.home.hero?.title[locale.value],
    description: pages.value.home.hero?.description[locale.value],
  };

  const pageBanner = {
    title: banner.value?.title[locale.value],
    description: banner.value?.description[locale.value],
    action: {
      label: banner.value?.action.label[locale.value],
      url: banner.value?.action.url,
    },
  };
  console.log({title, hero})
  return {
    title,
    content,
    hero,
    banner: pageBanner,
  };
});

const blockData = computed(() => {
  if (!buildingBlockCategories.value) return [];

  return buildingBlockCategories.value.map(({ title, description }) => ({
    title: title[locale.value],
    description: description[locale.value],
  }));
});



const CTALabel = {
  fr: "découvrir tous les blocs de construction",
  en: "discover all building blocks",
  nl: ";ontdek alle bouwstenen",
};


</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;

.content-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 2rem;
}

.action {
  margin-top: 1rem;
  gap: 1rem;
  max-width: 20rem;
}

.info-section {
  margin-top: 2rem;
  padding: 2rem;
  background: #8327CB20;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.categories-overview {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 50%;

}

.card {
  // height: 16rem;
  color: $text-color;
  background-color: white;
  border-radius: 1rem;
  // padding: 1.25rem;
  // border: 2px solid $light-blue;
  flex: calc(50% - 2rem);
  margin-bottom: 1rem;
  .title {
    font-weight: bold;
  }
  .description {
    font-size: 1.4rem;
  }
}

.case-preview {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.cases-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  gap: 1rem;
}

</style>
