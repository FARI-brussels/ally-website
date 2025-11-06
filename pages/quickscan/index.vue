<template>
  <div class="main">
    <div class="page-section-wrapper">
      <h1 class="title color-gray-light-mode-900">
        Build your personalised AI strategy block by block
      </h1>
      <p class="description color-gray-light-mode-500">
        Answer a few quick questions, and then submit at the bottom of the page.
        We’ll guide you to the building blocks that fit your organisation.
      </p>
    </div>
    <form class="form" @submit.prevent="handleSubmit">
      <div v-for="q in questions" :key="q.id" class="question">
        <label class="question-label">{{ q.question }}</label>
        <div class="options">
          <label
            v-for="opt in q.options"
            :key="opt.value"
            :class="['option', { selected: answers[q.id] === opt.value }]"
          >
            <input
              v-model="answers[q.id]"
              type="radio"
              :name="q.id"
              :value="opt.value"
            >
            <span class="option-letter">{{ opt.letter }}</span>
            <span class="option-label">{{ opt.label }}</span>
          </label>
        </div>
      </div>
      <AllyButton
        type="submit"
        variant="secondary"
        class="submit-btn"
        :block="isMobile"
        label="Submit"
        :disabled="!submitEnabled"
        @click="handleSubmit"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import {
  orgSizeField,
  orgTypeField,
  aiField,
  ethicsField,
  impactField,
  aiImpactField,
  resourceField,
  focusField,
} from "~/quickscan/questions";

import { calculateSuggestions } from "~/quickscan/logic";

const { blocks } = storeToRefs(useBuildingBlockStore());
const { getBlocks } = useBuildingBlockStore();
const { getBuildingBlockCategories } = useGlobalStore();
const isMobile = ref(false);
const router = useRouter();

const questions = [
  orgSizeField,
  orgTypeField,
  aiField,
  ethicsField,
  impactField,
  aiImpactField,
  resourceField,
  focusField,
];

onMounted(async () => 
  await Promise.all([getBuildingBlockCategories(), getBlocks()])
);

const answers = ref<Record<string, string>>({});

const submitEnabled = computed(
  () => Object.keys(answers.value).length === questions.length,
);

function handleSubmit() {
  const finalSuggestions = calculateSuggestions({
    answers: answers.value,
    blocks: blocks.value,
  });

  const idParam = finalSuggestions.join(",");
  router.push({
    path: "/quickscan/result",
    query: {
      blocks: idParam,
    },
  });
}
</script>

<style scoped lang="scss">
@use "/assets/scss/colors";

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

.page-section-wrapper {
  width: 40%;
  min-width: 350px;
  max-width: 700px;
}

@media (min-width: 1200px) {
  .page-section-wrapper {
    width: 66%;
  }
}

@media (min-width: 1200px) {
  .form {
    width: 66%;
  }
}

.question {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.question-label {
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0.1rem 0;
  margin-top: 2.5rem;
}

.options {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.option {
  display: flex;
  align-items: center;
  box-sizing: content-box;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid map-get(colors.$colors, "gray-light-mode-300");
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  user-select: none;
  width: fit-content;
  box-shadow: 0px 5px 4px -6px rgba(0, 0, 0, 0.4);
  transition: all 300ms ease;

  input {
    display: none;
  }

  .option-letter {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    background-color: map-get(colors.$colors, "gray-light-mode-700");
    color: map-get(colors.$colors, "base-white");
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.3rem;
    font-size: 0.8rem;
  }

  .option-label {
    font-size: 0.95rem;
    font-weight: medium;
  }

  &:hover {
    background-color: map-get(colors.$colors, "brand-100");
    .option-letter {
      background-color: map-get(colors.$colors, "brand-800");
    }
  }

  &.selected {
    border: 1.5px solid map-get(colors.$colors, "brand-900");

    .option-letter {
      background-color: map-get(colors.$colors, "brand-900");
    }
  }
}

.submit-btn {
  margin: 1.5rem 0;
}

.results {
  margin-top: 2rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    background: #f8f9fa;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  }
}
</style>

<style scoped lang="scss">
@use "/assets/scss/colors";

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

.page-section-wrapper {
  width: 40%;
  min-width: 350px;
  max-width: 700px;
}

@media (min-width: 1200px) {
  .page-section-wrapper {
    width: 66%;
  }
}

@media (min-width: 1200px) {
  .form {
    width: 66%;
  }
}

.question {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.question-label {
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0.1rem 0;
  margin-top: 2.5rem;
}

.options {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.option {
  display: flex;
  align-items: center;
  box-sizing: content-box;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid map-get(colors.$colors, "gray-light-mode-300");
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  user-select: none;
  width: fit-content;
  box-shadow: 0px 5px 4px -6px rgba(0, 0, 0, 0.4);
  transition: all 300ms ease;

  input {
    display: none;
  }

  .option-letter {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    background-color: map-get(colors.$colors, "gray-light-mode-700");
    color: map-get(colors.$colors, "base-white");
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.3rem;
    font-size: 0.8rem;
  }

  .option-label {
    font-size: 0.95rem;
    font-weight: medium;
  }

  &:hover {
    background-color: map-get(colors.$colors, "brand-100");
    .option-letter {
      background-color: map-get(colors.$colors, "brand-800");
    }
  }

  &.selected {
    border: 1.5px solid map-get(colors.$colors, "brand-900");

    .option-letter {
      background-color: map-get(colors.$colors, "brand-900");
    }
  }
}

.submit-btn {
  margin: 1.5rem 0;
}

.results {
  margin-top: 2rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    background: #f8f9fa;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  }
}
</style>
