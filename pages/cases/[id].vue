<template>
  <main class="main" :class="{ 'page-fade-in': pageVisible, 'main--loading': loading }">
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
        {{ alterativesTitle[locale] }}
      </h2>
      <div class="alternatives-section-list" :class="{ 'alternatives-section-list--mobile': isMobile }">
        <TransitionGroup name="stagger-fade" tag="div">
          <CardMain
            :image="getImage(selectedCase?.building_blocks_used?.category?.slug)"
            :category="selectedCase?.building_blocks_used?.category?.slug[locale]"
            :title="selectedCase?.building_blocks_used.title[locale]"
            :description="selectedCase?.building_blocks_used.description[locale]"
            :url="`/building-blocks/${selectedCase?.building_blocks_used.id}`"
            @click="navigateTo(`/building-blocks/${selectedCase?.building_blocks_used.id}`)"
          />
        </TransitionGroup>
      </div>
    </div>
  </main>
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
  setTimeout(() => {
    pageVisible.value = true;
  }, 50);
});

const { isMobile } = useIsMobile();

function getImage(category: CategorySlug) {
  if (!category) return '';
  return `/blocks/${mapCategory(category)}-${Math.floor(Math.random() * 3) + 1}.png`;
}

const alterativesTitle = {
  en: 'Building blocks used in this case',
  nl: 'Bouwstenen die in dit geval zijn gebruikt',
  fr: 'Blocs de construction utilisés dans ce cas',
};
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;

// Layout
.main {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-in {
  opacity: 1;
  transform: translateY(0);
}

.main--loading {
  pointer-events: none;
}

// Section: Intro
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
  display:flex;
  flex-direction: column;
  gap: 2rem;
  width: 50%;

  &--mobile {
    width: 100%;
    align-items: center;
  }
}


// Section: Alternatives
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

// Utilities & Transitions
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

// Loader (not currently used, but kept for future use)
.page-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  z-index: 1000;
}
.spinner {
  width: 3rem;
  height: 3rem;
  border: 0.4rem solid #e0e0e0;
  border-top: 0.4rem solid #7b5be6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.fade-loader-enter-active, .fade-loader-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-loader-enter-from, .fade-loader-leave-to {
  opacity: 0;
}
.fade-loader-enter-to, .fade-loader-leave-from {
  opacity: 1;
}
</style>
