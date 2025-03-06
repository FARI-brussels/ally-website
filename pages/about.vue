<template>
  <main class="main">
    <div class="about-container">
      <PageSection
        v-if="pageData.content?.length"
        html
        on-dark
        title=" "
        :description="pageData.content[0]"
      />
    </div>
    <!-- <div class="logos">
      <img class="logo" src="~/assets/logos/AIFlanders.svg" />
      <img class="logo" src="~/assets/logos/ULBVUBcolored.svg" />
      <img class="logo" src="~/assets/logos/EU.svg" />
    </div> -->

    <div class="sections">
      <PageSection
        v-if="pageData.content?.length"
        html
        title=" "
        class="section-top"
        :description="pageData.content[1]"
      />
      <PageSection
        v-if="pageData.content?.length"
        html
        title=" "
        :description="pageData.content[2]"
      />
  </div>
  </main>
</template>

<script setup lang="ts">
const { getStaticPage } = useStaticPageStore();
const { locale } = storeToRefs(useGlobalStore());
const { pages } = storeToRefs(useStaticPageStore());

onMounted(async () => getStaticPage("about"));

const pageData = computed(() => {
  if (!pages.value.about)
    return {
      title: null,
      content: null,
    };

  const title = pages.value.about?.title[locale.value];
  const content = pages.value.about?.content?.map((c) => c[locale.value]);

  const hero = {
    media: pages.value.about.hero?.media,
    title: pages.value.about.hero?.title[locale.value],
    description: pages.value.about.hero?.description[locale.value],
  };

  return {
    title,
    content,
    hero,
  };
});
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;

.about-container {
  background-color: $deep-purple;
  border-radius: 0.8rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100%;
}

.logos {
  display: flex;
  justify-content: space-around;
}

.logo {
  width: 20rem;
  height: auto;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;
}
</style>
