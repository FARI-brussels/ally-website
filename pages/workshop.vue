<template>
  <div class="workshop-page">
    <div :class="['workshop-hero', { 'workshop-hero--mobile': isMobile }]">
      <div
        :class="[
          'workshop-hero__content',
          { 'workshop-hero__content--mobile': isMobile },
        ]"
      >
        <p class="workshop-hero__label color-brand-800">Workshop</p>

        <PageSection
          title="Kickstart Your AI Journey with Confidence"
          description="Would you like to get started with ALLY by exploring the building blocks in an interactive session? Then our workshop is perfect for you!"
        />

        <AllyButton
          label="Request a workshop"
          variant="secondary"
          :block="isMobile"
          class="workshop-hero__cta"
          @click="openWorkshopForm"
        />
      </div>
      <img
        :class="['workshop-hero__image', { 'full-width-section': isMobile }]"
        src="/images/workshop.png"
        alt="Image representing the ALLY workshop"
      />
    </div>

    <PageSection
      class="section-main-info"
      title="Discover the essential building blocks of a responsible AI approach"
      description="The 'Start with ALLY' workshop helps organisations prioritise the activities and actions needed to responsibly deploy AI as an organisation. We zoom in on your organisation's strategic goals related to AI innovation and how to approach them responsibly. Using the ALLY card set, we look at what actions for a responsible AI strategy your organisation is already taking and what further steps are desired. These building blocks serve as a starting point to work out a clear strategy and roadmap."
    />

    <div
      :class="['section-features', { 'section-features--mobile': isMobile }]"
    >
      <div class="feature-cards">
        <div :class="['feature-card', { 'feature-card--mobile': isMobile }]">
          <div class="feature-card__icon-container">
            <img src="~/assets/icons/building.svg" alt="Building icon" />
          </div>

          <div class="feature-card__content">
            <h4>For Organisations Ready to Take the Next Step in AI</h4>
            <p>
              An ALLY workshop is for all organisations, both public and
              private, that want to get started with AI and want to approach
              this in a responsible and strategic way. Organisations can still
              be at the very start of their AI adventure or have already
              experimented a lot: with ALLY, we start from where you are and
              where you want to go.
            </p>
          </div>
        </div>

        <div :class="['feature-card', { 'feature-card--mobile': isMobile }]">
          <div class="feature-card__icon-container">
            <img src="~/assets/icons/roadmap.svg" alt="Roadmap icon" />
          </div>
          <div class="feature-card__content">
            <h4>Leave with a Concrete Roadmap Tailored to Your Organisation</h4>
            <p>
              At the end of this process, you will have a roadmap, or action
              plan, detailing the actions your organisation will take to deploy
              AI responsibly. This roadmap will help you make targeted
              investments in responsible AI, define internal responsibilities
              and avoid risks in terms of reputation, adoption and social
              resistance.
            </p>
          </div>
        </div>
      </div>

      <img
        :class="[
          'section-features__image',
          { 'section-features__image--mobile': isMobile },
        ]"
        src="/images/workshop2.png"
        alt="Image showing workshop participants"
      />
    </div>

    <div class="cta-banner">
      <h3 class="cta-banner__title">Curious about the workshop?</h3>
      <p class="cta-banner__description">
        Drop us a line, we’d love to hear from you!
      </p>
      <AllyButton
        label="Request a workshop"
        variant="secondary"
        :block="isMobile"
        class="cta-banner__cta"
        @click="openWorkshopForm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIsMobile } from "@/composables/useIsMobile";

const { isMobile } = useIsMobile();

const config = useRuntimeConfig();
const formUrl = config.public.workshopFormUrl;

const openWorkshopForm = () => {
  if (formUrl) window.open(formUrl, "_blank");
  else console.error("Workshop Form URL is not defined in runtime config.");
};
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;
@use "/assets/scss/typography";
@use "sass:map";

.full-width-section {
  margin: 1rem -50vw;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.workshop-hero {
  display: flex;
  margin-bottom: 4rem;

  &--mobile {
    flex-direction: column;
    margin-bottom: 0;
  }

  &__content {
    display: flex;
    flex-direction: column;
    width: 50%;
    font-size: 1.2rem;

    &--mobile {
      width: 100%;
    }
  }

  &__label {
    margin: 1rem 0;
    font-weight: typography.$text-medium-bold;
  }

  &__cta {
    margin: 2rem 0;
  }

  &__image {
    margin-left: auto;
    width: 40%;
  }
}

.section-main-info {
  margin-bottom: 2rem;
}

.section-features {
  display: flex;
  gap: 6rem;
  align-items: center;

  &--mobile {
    flex-direction: column;
  }

  &__image {
    max-width: 40%;

    &--mobile {
      max-width: 110%;
      margin-bottom: 2rem;
    }
  }
}

.feature-cards {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-size: 1.2rem;
}

.feature-card {
  display: flex;
  gap: 1.5rem;

  &--mobile {
    flex-direction: column;
    gap: 0.5rem;
  }

  &__icon-container {
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    padding: 1.2rem;
    border-radius: 0.5rem;
    display: flex;
    border: 1px solid map.get($colors, "gray-light-mode-200");
    align-items: center;
    justify-content: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }
}

.cta-banner {
  background-color: map.get($colors, "gray-light-mode-50");
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1rem;
  padding: 4rem;
  margin: 4rem 0;
  text-align: center;

  &__title {
    font-weight: typography.$text-bold;
    font-size: 2rem;
  }

  &__description {
    font-weight: typography.$text-medium;
    font-size: 1.2rem;
    color: map.get($colors, "gray-light-mode-600");
    margin-bottom: 1.5rem;
  }
}
</style>
