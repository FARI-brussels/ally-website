<template>
  <div
    class="main"
    :class="{ 'page-fade-in': pageVisible, 'main--loading': loading }"
  >
    <div class="breadcrumb">
      <BreadCrumb
        category-text="Case"
        :label-text="selectedCase?.title?.[locale] || ''"
      />
    </div>

    <div class="intro-section" :class="{ 'intro-section--mobile': isMobile }">
      <PageSection
        html
        :title="selectedCase?.title[locale]"
        :description="selectedCase?.description[locale]"
      />
    </div>

    <div class="main-content">
      <div class="page-items" :class="{ 'page-items--mobile': isMobile }">
        <PageSection
          title=" "
          html
          :description="selectedCase?.content[locale]"
        />
      </div>
    </div>

    <div v-if="selectedCase?.building_blocks_used" class="alternatives-section">
      <h2 class="section-title">
        {{ blocksUsed[locale] }}
      </h2>
      <div
        class="alternatives-section-list"
        :class="{ 'alternatives-section-list--mobile': isMobile }"
      >
        <TransitionGroup name="stagger-fade" tag="div">
          <CardMain
            v-for="block in selectedCase?.building_blocks_used"
            :key="block.id"
            :image="getImage(block.category?.slug)"
            :category="block.category?.title[locale]"
            :title="block.title[locale]"
            :description="block.description[locale]"
            :url="`/building-blocks/${block.id}`"
            @click="navigateTo(`/building-blocks/${block.id}`)"
          />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale } = storeToRefs(useGlobalStore());
const { selectedCase } = storeToRefs(useCasesStore());
const { findCase } = useCasesStore();
const route = useRoute();

const loading = ref(true);
const pageVisible = ref(false);

onMounted(async () => {
  await findCase(Number(route.params.id));
  loading.value = false;
  setTimeout(() => (pageVisible.value = true), 50);
});

const { isMobile } = useIsMobile();

function getImage(category: CategorySlug) {
  if (!category) return "";
  return `/blocks/${mapCategory(category)}-${Math.floor(Math.random() * 3) + 1}.png`;
}

const blocksUsed = {
  en: "Building blocks used in this case",
  nl: "Bouwstenen die in dit geval zijn gebruikt",
  fr: "Blocs de construction utilisés dans ce cas",
};
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;

.main {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-title {
  font-size: 2.2rem;
  margin-top: 1.2rem;
}

.page-fade-in {
  opacity: 1;
  transform: translateY(0);
}

.main--loading {
  pointer-events: none;
}

.intro-section {
  display: flex;
  justify-content: space-between;
  margin: 3rem 0;

  &-text {
    max-width: 50%;
  }

  &-image {
    max-width: 24rem;
    border-radius: 1rem;
  }

  &--mobile {
    flex-direction: column;
    align-items: center;
    gap: 2rem;

    .intro-section-text {
      max-width: 100%;
      width: 100%;
    }
    &-image {
      max-width: 100%;
    }
  }
}

.main-content {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
}

.page-items {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 50%;

  &--mobile {
    width: 100%;
    align-items: center;
  }
}

.alternatives-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;

  &-description {
    font-size: 1rem;
    font-weight: 400;
  }

  &-list {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;

    &--mobile {
      flex-direction: column;
      align-items: center;
    }
  }
}

.stagger-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.stagger-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.stagger-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-loader-enter-active,
.fade-loader-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-loader-enter-from,
.fade-loader-leave-to {
  opacity: 0;
}
.fade-loader-enter-to,
.fade-loader-leave-from {
  opacity: 1;
}
</style>
