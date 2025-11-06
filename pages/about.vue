<template>
  <div class="main">
    <div
      class="introduction full-width-section bg-color-brand-25"
      :class="{
        'introduction-mobile': isMobile,
      }"
    >
      <strong class="color-brand-700">About</strong>
      <h1 class="title">{{ pageData.title }}</h1>
      <p>{{ pageData.description }}</p>

      <section class="intro-sections">
        <div
          v-for="(section, idx) in introSections"
          :key="idx"
          class="intro-section"
        >
          <div class="icon-container bg-color-brand-200">
            <img :src="section.icon" :alt="section.alt" class="icon-image">
          </div>
          <h2>{{ section.title }}</h2>
          <p>{{ section.text }}</p>
        </div>
      </section>

      <section class="intro-sections">
        <div
          v-for="(section, idx) in extraSections"
          :key="idx"
          class="intro-section"
        >
          <div class="icon-container bg-color-brand-200">
            <img :src="section.icon" :alt="section.alt">
          </div>
          <div v-if="section.contentClass" :class="section.contentClass">
            <h2>{{ section.title }}</h2>
            <p>{{ section.text }}</p>
          </div>
          <template v-else>
            <h2>{{ section.title }}</h2>
            <p>{{ section.text }}</p>
          </template>
        </div>
      </section>

      <div class="logos bg-color-base-white">
        <h3>Developed by Experts</h3>
        <p>Ally has been jointly developed by:</p>
        <div class="logos-container">
          <div v-for="(logo, idx) in logos" :key="idx" class="logo-container">
            <img class="logo" :src="logo.src" :alt="logo.alt">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p class="logo-description" v-html="logo.description" />
          </div>
        </div>
      </div>
    </div>

    <WhyAlly />

    <AllyDivider />

    <div class="ally-process-container">
      <h2 class="ally-process-title">The ALLY Process</h2>
      <p class="ally-process-description">
        ALLY supports organisations step by step: from exploring challenges and
        identifying priorities, to planning with tailored building blocks,
        building your governance approach, and sharing your progress. Whether
        you're just starting or ready to scale, this process helps you turn
        ethical intentions into tangible actions.
      </p>

      <section class="ally-process-sections" :class="{ mobile: isMobile }">
        <div
          v-for="(section, idx) in allyProcessSections"
          :key="idx"
          class="ally-process-section bg-color-gray-light-mode-50"
        >
          <img :src="section.icon" :alt="section.alt">
          <h2>{{ section.title }}</h2>
          <p>{{ section.text }}</p>
        </div>
      </section>
    </div>

    <section class="legislation-section">
      <h2 class="legislation-title">{{ legislationSection.title }}</h2>
      <p class="legislation-description">
        {{ legislationSection.description }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStaticPageStore } from "@/stores/staticPage";
import { useIsMobile } from "@/composables/useIsMobile";
import AllyDivider from "~/components/AllyDivider.vue";

import challengesIcon from "@/assets/icons/about/challenges.svg";
import zapIcon from "@/assets/icons/about/zap.svg";
import organizationIcon from "@/assets/icons/about/organization.svg";
import pillarsIcon from "@/assets/icons/about/pillars.svg";
import bookmarkIcon from "@/assets/icons/about/bookmark.svg";
import kdmIcon from "@/assets/icons/about/kdm.svg";
import fariIcon from "@/assets/icons/about/FARI.svg";
import exploreIcon from "@/assets/icons/process/explore.svg";
import planIcon from "@/assets/icons/process/plan.svg";
import buildIcon from "@/assets/icons/process/build.svg";
import shareIcon from "@/assets/icons/process/share.svg";

const { getStaticPage } = useStaticPageStore();
const { pages } = storeToRefs(useStaticPageStore());
const { isMobile } = useIsMobile();

onMounted(async () => getStaticPage("about"));

const pageData = computed(() => {
  const about = pages.value?.about;
  if (!about)
    return {
      title: "ALLY: Your strategy for responsible AI",
      description:
        "ALLY is a comprehensive guide designed to help businesses create an actionable, organisation-wide governance strategy for responsible AI.",
    };
  return {
    title: "ALLY: Your strategy for responsible AI",
    description:
      "ALLY is a comprehensive guide designed to help businesses create an actionable, organisation-wide governance strategy for responsible AI.",
  };
});

const introSections = [
  {
    icon: challengesIcon,
    alt: "Pillars",
    title: "Tackling Ethical AI Challenges",
    text: "Every organisation using or planning to use AI faces critical concerns such as bias, privacy, sustainability, and quality of work.",
  },
  {
    icon: zapIcon,
    alt: "Pillars",
    title: "Actionable Building Blocks",
    text: "ALLY offers practical building blocks to help organisations build a tailored governance strategy for responsible AI.",
  },
  {
    icon: organizationIcon,
    alt: "Pillars",
    title: "For All Organisation Types",
    text: "Whether you're a small startup or a large public institution, ALLY is designed to support both private and public sectors.",
  },
];

const extraSections = [
  {
    icon: pillarsIcon,
    alt: "Pillars",
    title: "Four Pillars of Responsible AI",
    text: "The building blocks are structured around four key pillars: Values & Structures, Processes & Methods, Culture & Skills, Communication & Participation",
  },
  {
    icon: bookmarkIcon,
    alt: "Pillars",
    title: "Real-World Inspiration",
    text: "Browse cases that show how other organisations are implementing responsible AI.",
    contentClass: "intro-section-2-content",
  },
];

const allyProcessSections = [
  {
    icon: exploreIcon,
    alt: "explore",
    title: "1. Explore",
    text: "Understand what responsible AI could mean for your organisation. Use the QuickScan, try the ALLY demo, browse building blocks, and get inspired by real cases.",
  },
  {
    icon: planIcon,
    alt: "plan",
    title: "2. Plan",
    text: "Define your priorities and map out your strategy. Join an ALLY workshop and select the building blocks that fit your goals and context.",
  },
  {
    icon: buildIcon,
    alt: "build",
    title: "3. Build",
    text: "Put your strategy into practice. Start implementing selected building blocks and integrate responsible AI into your daily operations.",
  },
  {
    icon: shareIcon,
    alt: "share",
    title: "4. Commit & share",
    text: "Show your commitment and inspire others. Share your experience and contribute a case to help grow the responsible AI community.",
  },
];

const legislationSection = {
  title: "Ally and legislation",
  description:
    "ALLY is not a legal compliance tool and does not contain building blocks that directly address compliance with the AI Act, GDPR or any other legal frameworks. However, ALLY does complement legal frameworks, and goes one step further to support you in setting up the structures and actions that are required to achieve responsible AI. To improve your organisation's legal compliance specifically, we recommend consulting a legal expert or tool specifically aimed at legal compliance.",
};

const logos = [
  {
    src: kdmIcon,
    alt: "KDM",
    description:
      "The Knowledge Centre Data & Society is the central hub for the <strong>legal, social and ethical aspects </strong> of data-driven and AI applications. It brings together knowledge and experience on the interface of AI, data and societal issues tailored to industry, policy, civil society and the general public. The Knowledge Centre Data & Society has a broad mission and spectrum of activities: advice, training, process guidance, lectures and workshops.",
  },
  {
    src: fariIcon,
    alt: "FARI",
    description:
      "FARI is an independent, not-for-profit artificial intelligence initiative led by the Vrije Universiteit Brussel (VUB) and the Université Libre de Bruxelles (ULB). The research institute aims to enable, promote and perform excellent cross-disciplinary research on artificial intelligence in Brussels, inspired by the humanistic values of freedom, equality and solidarity that lay at the foundations of both the VUB and the ULB, internationally acclaimed and with a local impact.",
  },
];
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;

.introduction {
  padding: 4rem 8rem;
  &-mobile {
    padding: $mobile-padding;
  }
}

.title {
  font-size: 3rem;
  font-weight: 700;
}

.full-width-section {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 1rem;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;
}

.intro-sections,
.why-ally-sections {
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  justify-content: center;
}

.intro-section,
.why-ally-section {
  width: 20rem;
  max-width: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.about-container {
  border-radius: 0.8rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100%;
}

.icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logos {
  display: flex;
  flex-direction: column;
  border-radius: 0.8rem;
  width: 100%;
  padding: 2rem;
  text-align: center;
}

.logos-container {
  height: 100%;
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  text-align: left;
  justify-content: space-evenly;

  .logo-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 20rem;
    justify-content: center;
  }
}

.ally-process {
  &-container {
    padding: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-title {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
  }

  &-description {
    text-align: center;
    max-width: 40rem;
    margin-bottom: 2rem;
  }

  &-sections {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    justify-content: center;
  }

  &-sections.mobile {
    grid-template-columns: 1fr;
  }

  &-section {
    width: 30rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    align-items: center;
    gap: 1rem;
  }
}

.legislation {
  &-section {
    text-align: center;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
  }

  &-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  &-description {
    font-size: 1.2rem;
  }
}

@media (max-width: 1200px) {
  .legislation-section {
    width: 70%;
  }
}

@media (max-width: 900px) {
  .legislation-section {
    width: 90%;
  }
}

@media (max-width: 600px) {
  .legislation-section {
    width: 100vw;
    margin-left: -50vw;
    left: 50%;
    right: 50%;
    margin-right: -50vw;
    padding: 1rem 0;
    position: relative;
    box-sizing: border-box;
  }
}
</style>
