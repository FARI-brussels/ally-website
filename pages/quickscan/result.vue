<template>
  <div class="main">
    <HeroQuickScan
      v-bind="heroProps"
      :class="isMobile ? 'hero full-width-section' : 'hero'"
    />

    <div v-if="error" class="error-message">
      An error occurred while loading your results: {{ error.message }}
    </div>

    <div v-if="results.length" class="results-list">
      <div
        v-for="{ title, description, blocks } in organizedBlocks"
        :key="title"
        class="block-section"
      >
        <PageSection v-bind="{ title, description }" class="block-section" />
        <BlockList :blocks="blocks" expanded />
      </div>
    </div>

    <AllyDivider />

    <div
      class="workshop"
      :class="{
        workshop: true,
        'workshop-mobile': isMobile,
      }"
    >
      <div class="workshop-text">
        <PageSection
          title="Kickstart Your AI Journey with Confidence"
          description="Would you like to get started with ALLY by exploring the building blocks in an interactive session? Then our workshop is perfect for you!"
        />

        <AllyButton
          label="Learn more about our Workshop"
          variant="secondary"
          :block="isMobile"
          class="workshop-btn"
          append-icon="arrow-right"
          @click="$router.push('/workshop')"
        />
      </div>
      <img
        :class="{
          'workshop-img': true,
          'full-width-section': isMobile,
        }"
        src="/images/workshop.png"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlockMetadata } from "~/quickscan/blockData";

const route = useRoute();
const buildingBlockStore = useBuildingBlockStore();
const { locale, buildingBlockCategories } = storeToRefs(useGlobalStore());
const { getBuildingBlockCategories } = useGlobalStore();
const results = ref<BlockMetadata[]>([]);
const error = ref<Error | null>(null);
const { isMobile } = useIsMobile();

onMounted(async () => {
  await getBuildingBlockCategories();
  const blockIdsString = route.query.blocks as string | undefined;

  if (!blockIdsString) {
    error.value = new Error("No block IDs found in the URL.");
    return;
  }

  const requestedIds = blockIdsString
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id));

  if (requestedIds.length === 0) {
    error.value = new Error("Invalid or empty list of block IDs.");
    return;
  }

  try {
    const fetchPromises = requestedIds.map(async (id) => 
      await buildingBlockStore.getBlock(id));

    const fetchedBlocks = await Promise.all(fetchPromises);

    results.value = fetchedBlocks
      .filter((block): block is BlockMetadata => !!block)
      .map((b) => ({
        ...b,
        title: b.title[locale.value],
        description: b.description[locale.value],
        category: b?.category.slug,
      }));

    results.value.forEach((block) =>
      organizedBlocks[block.category].blocks.push(block),
    );

    buildingBlockCategories.value.forEach(({ slug, title, description }) => {
      organizedBlocks[slug].title = title[locale.value];
      organizedBlocks[slug].description =
        description[locale.value];
    });
  } catch (err) {
    console.error("Error fetching building blocks:", err);
    error.value = err as Error;
  }
});

const organizedBlocks = reactive({
  "values-structures": {
    title: "",
    description: "",
    blocks: [],
  },
  "culture-skills": {
    title: "",
    description: "",
    blocks: [],
  },
  "communication-participation": {
    title: "",
    description: "",
    blocks: [],
  },
  "methods-processes": {
    title: "",
    description: "",
    blocks: [],
  },
});

const heroProps = {
  media: "",
  heading: "QuickScan Result",
  title: "Your Personalised AI Strategy",
  description:
    "Thanks for completing the Quickscan. Based on your responses, we’ve selected the most relevant building blocks to help you embed responsible AI in your organisation.",
};
</script>

<style scoped>
.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.content-wrapper {
  margin-bottom: 2rem;
}

.block-section {
  margin: 5rem 0 2rem 0;
}

.full-width-section {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.workshop {
  display: flex;
  margin-bottom: 4rem;

  &-text {
    display: flex;
    flex-direction: column;
  }
}

.workshop-mobile {
  flex-direction: column;
  margin-bottom: 0;
}

.workshop-btn {
  margin: 2rem 0;
}

.workshop-img {
  margin-top: 2rem;
}
</style>
