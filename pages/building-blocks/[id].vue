<template>
  <div class="main" :class="{ 'page-fade-in': pageVisible, 'main--loading': loading }">
    <Transition name="fade-loader">
      <div v-if="loading" class="page-loader" key="loader">
        <span class="spinner"></span>
      </div>
    </Transition>

    <div class="intro-section" :class="{ 'intro-section--mobile': isMobile }">
        <PageSection
          html
          :title="selectedBlock?.title[locale] || ''"
          :description="selectedBlock?.description[locale] || ''"
          :categories="[selectedBlock?.category.title[locale]]"
          class="intro-section-text"
        />
        <img
          v-if="selectedBlock?.category?.slug"
          :src="getImage(selectedBlock.category.slug)"
          alt="Block visual"
          class="intro-section-image"
        >
    </div>

    <div class="main-content">

    <div class="page-items" :class="{ 'page-items--mobile': isMobile }">
      <PageSection
        html
        :title="benefitsTitle[locale] || ''"
        :description="selectedBlock?.benefits[locale] || ''"

      />
      <CardBlockRequirement
          v-if="isMobile"
          class="requirements"
          :locale="locale"
          :cost="selectedBlock?.cost || ''"
          :effort="selectedBlock?.effort || ''"
          :involvement="selectedBlock?.involvement || ''"
          :time="selectedBlock?.time || ''"
          :maintenance="selectedBlock?.maintenance || ''"
        />
      <PageSection
        html
        :title="howToExecuteTitle[locale] || ''"
        :description="selectedBlock?.how_to_execute[locale] || ''"
      />
      <PageSection
        html
        :title="kpisTitle[locale] || ''"
        :description="selectedBlock?.kpis[locale] || ''"
      />

    </div>

    <div v-if="!isMobile" class="sidebar">
      <div class="sidebar-inner">
        <CardBlockRequirement
          class="requirements"
          :locale="locale"
          :cost="selectedBlock?.cost || ''"
          :effort="selectedBlock?.effort || ''"
          :involvement="selectedBlock?.involvement || ''"
          :time="selectedBlock?.time || ''"
          :maintenance="selectedBlock?.maintenance || ''"
        />
      <div v-if="!isMobile" class="copy-link-container">
          <h3 class="copy-link-title"> Share this block </h3>
          <AllyButton 
            :prepend-icon="copyLinkIcon" 
            :label="copyLinkText"
            variant="gray"
            @click="copyLinkToClipBoard"
            />
        </div>
      </div>
    </div>

  </div>



  <div class="links full-width-section bg-color-brand-25">

    <PageSection
          :title="externalLinksTitle[locale]"
          :description="externalLinksParagraph[locale] || ''"
        />
        <div class="external-links-list" :class="{ 'external-links-list--mobile': isMobile }">



        <a 
          v-for="link in selectedBlock?.external_links"
          :key="link.id"
          class="external-links"
          target="_blank"
          :href="link.url"

        >
        <div class="external-links-title">
          <h2 class="section-title">{{ link.title[locale] }}</h2>

          <img src="/assets/icons/external-link.svg" class="external-links-title-icon">
        </div>
        <p>{{ link.description?.[locale] }}</p>
      </a>

    </div>
      </div>



    <div v-if="selectedBlock?.alternative_building_blocks.length" class="alternatives-section">
      <h2 class="section-title" >
        {{ alterativesTitle[locale] }}
      </h2>
      <p class="alternatives-section-description">
        {{ alternativesDescription[locale] }}
      </p>

      <TransitionGroup name="stagger-fade" tag="div" class="alternatives-section-list" :class="{ 'alternatives-section-list--mobile': isMobile }">
        <CardMain
          v-for="(block, idx) in selectedBlock?.alternative_building_blocks"
          :key="block.id"
          :style="{ transitionDelay: (idx * 100) + 'ms' }"
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
</template>
<script setup lang="ts">
import { mapCategory } from '~/utils/mapCategory';
import type { CategorySlug } from '~/types/components';
import { useIsMobile } from '~/composables/useIsMobile';
import { ref, onMounted } from 'vue';

const { locale } = storeToRefs(useGlobalStore());
const { selectedBlock } = storeToRefs(useBuildingBlockStore());
const { findBlock } = useBuildingBlockStore();
const route = useRoute();

const { isMobile } = useIsMobile();

const loading = ref(true);
const pageVisible = ref(false);

onMounted(async () => {
  await findBlock(Number(route.params.id));
  loading.value = false;
  setTimeout(() => {
    pageVisible.value = true;
  }, 50);
});

function getImage(category: CategorySlug) {
  if (!category) return '';
  return `/blocks/${mapCategory(category)}-${Math.floor(Math.random() * 3) + 1}.png`;
}

const copyLinkIcon = ref('copy-link')
const copyLinkText = ref('Copy link to this building block')

function copyLinkToClipBoard() {
  navigator.clipboard.writeText(window.location.href);
  copyLinkIcon.value = 'check'
  copyLinkText.value =  'Copied!'

  setTimeout(() => { 
    copyLinkIcon.value = 'copy-link' 
    copyLinkText.value = 'Copy link to this building block'
  }, 5000)
}


const alterativesTitle = {
  en: "Alternative building blocks",
  nl: "Alternatieve bouwstenen",
  fr: "Blocs de construction alternatifs",
};

const alternativesDescription = {
  en: "Explore these supporting materials to enhance your understanding and gain comprehensive insights into the topic at hand.",
  nl: "Verken deze ondersteunende materialen om uw begrip te vergroten en uitgebreid inzicht te krijgen in het onderwerp.",
  fr: "Explorez ces documents de soutien pour améliorer votre compréhension et obtenir des informations complètes sur le sujet traité.",
};

const benefitsTitle = {
  en: "How does this building block help?",
  nl: "Hoe helpt deze bouwsteen?",
  fr: "Comment ce bloc de construction aide-t-il ?",
};

const howToExecuteTitle = {
  en: "How can you execute this building block?",
  nl: "Hoe kun je deze bouwsteen uitvoeren?",
  fr: "Comment pouvez-vous exécuter ce bloc de construction ?",
};

const kpisTitle = {
  en: "What KPI's can you set for yourself?",
  nl: "Welke KPI's kunt u voor uzelf instellen?",
  fr: "Quels indicateurs clés de performance pouvez-vous définir pour vous-même ?",
};

const externalLinksTitle = {
  en: "Dive deeper",
  nl: "Dieper duiken",
  fr: "Explorer",
};

const externalLinksParagraph = {
  en: "Explore these supporting materials to enhance your understanding and gain comprehensive insights into the topic at hand.",
  nl: "Verken deze ondersteunende materialen om uw begrip te vergroten en uitgebreid inzicht te krijgen in het onderwerp.",
  fr: "Explorez ces documents de soutien pour améliorer votre compréhension et obtenir des informations complètes sur le sujet traité.",
};
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;
.main {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
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

.copy-link-container {
  width: 24rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  border-radius: 1rem;
  padding: 2rem;
  cursor: default;
  border: 1px solid map-get($colors, 'gray-light-mode-200');

  button {
    display: flex;
    padding: 10px 14px;
    justify-content: center;
    align-items: center;
    border-radius: 1rem;
    border: 0;
    padding: 1rem 0.75rem;
  }

  .icon-svg {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
}
}

.copy-link-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.links {
  padding: $desktop-padding;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  gap: 2rem;
}

.full-width-section {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.external-links {
  display: flex;
  flex-direction: column;

 
  gap: 2rem;
  width: 20rem;
  cursor: pointer;
  &:hover {
    transform: scale(1.03);
  }
  &:-webkit-any-link {
    color: black;
  }

  &-title {
    display: flex;
    align-items: start;
    gap: 1rem;    
  }

  &-list {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;

    &--mobile {
      flex-direction: column;
      align-items: center;
    }
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


.page-fade-in {
  opacity: 1;
  transform: translateY(0);
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

.main--loading {
  pointer-events: none;
}

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
