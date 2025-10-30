<template>
  <div class="why-ally-container">
    <h2 class="why-ally-title">Why should you use Ally?</h2>
    <p class="why-ally-description">
      Choose your path to action: run a quick scan to identify your next steps
      or join a workshop to co-create your responsible AI strategy.
    </p>

    <section class="why-ally-sections">
      <div
        v-for="(section, idx) in whyAllySections"
        :key="idx"
        class="why-ally-section"
      >
        <div class="icon-container bg-color-brand-200">
          <img :src="section.icon" :alt="section.alt" >
        </div>
        <h2>{{ section.title }}</h2>
        <p>{{ section.text }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import successIcon from "@/assets/icons/about/success.svg";
import trustIcon from "@/assets/icons/about/trust.svg";
import solutionsIcon from "@/assets/icons/about/solutions.svg";

const whyAllySections = [
  {
    icon: successIcon,
    alt: "Pillars",
    title: "Responsible AI Success",
    text: "ALLY boosts your chances of designing, developing, implementing, and using responsible AI innovations.",
  },
  {
    icon: trustIcon,
    alt: "Pillars",
    title: "Earn Trust and Reputation",
    text: "Responsible AI benefits society and your business alike by building trust and credibility with every stakeholder.",
  },
  {
    icon: solutionsIcon,
    alt: "Pillars",
    title: "Pragmatic Ethical Solutions",
    text: "ALLY lays out clear, actionable steps to embed ethics in organisation-wide AI governance, drawing on others' successes and lessons to strengthen your own strategy.",
  },
];
</script>

<style scoped lang="scss">
.icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.why-ally {
  &-container {
    padding: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-title {
    text-align: center;
  }

  &-description {
    text-align: center;
    max-width: 40rem;
  }
}

.why-ally-sections {
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  justify-content: center;
}

.why-ally-section {
  width: 20rem;
  max-width: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}
</style>
