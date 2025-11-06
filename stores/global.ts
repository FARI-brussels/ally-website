import type { Locale } from "~/types/shared";
import { createDirectus, rest, readItems, readItem } from "@directus/sdk";
import { mapCategory } from "~/utils/mapCategory";

const client = createDirectus("https://fari-cms.directus.app").with(rest());

export const useGlobalStore = defineStore("global", () => {
  const locale = ref<Locale>("en");
  const error = ref(null);
  const loading = ref(false);
  const buildingBlockCategories = ref();
  const selectedCategory = ref();

  const banner = ref({
    title: {
      en: "Unsure where your journey starts?",
      nl: "Weet u niet zeker waar uw reis begint?",
      fr: "Vous ne savez pas où commence votre voyage ?",
    },
    description: {
      en: "Check what policy actions have priority on your path towards an ethical policy on AI",
      nl: "Controleer welke beleidsmaatregelen prioriteit hebben op uw pad naar een ethisch beleid inzake AI",
      fr: "Vérifiez quelles actions politiques sont prioritaires sur votre chemin vers une politique éthique sur l'IA",
    },

    action: {
      label: {
        en: "Discover your own path",
        nl: "Ontdek je eigen pad",
        fr: "Découvrez votre propre chemin",
      },
      url: "",
    },
  });

  function setLocale(l: Locale) {
    locale.value = l;
  }

  async function getBuildingBlockCategories() {
    const data = await client.request(
      readItems("ally_category", {
        fields: ["*.*"],
      }),
    );

    buildingBlockCategories.value = data.map(parseBlockData);
  }

  async function getBuildingBlockCategory(slug: string) {
    if (!slug) return null;
    const data = await client.request(
      readItem("ally_category", slug, {
        fields: ["*.*"],
      }),
    );

    const parsed = parseBlockData(data);
    selectedCategory.value = parsed;

    return selectedCategory.value;
  }

  async function findBuildingBlockCategory(slug: string) {
    if (!slug) return null;

    if (selectedCategory.value && selectedCategory.value.slug === slug)
      return selectedCategory.value;

    if (!selectedCategory.value) return await getBuildingBlockCategory(slug);

    if (buildingBlockCategories.value) {
      const found = buildingBlockCategories.value.find((c) => c.slug === slug);
      if (found) selectedCategory.value = found;
      else await getBuildingBlockCategory(slug);

      return selectedCategory.value;
    } else return await getBuildingBlockCategory(slug);
  }

  return {
    locale,
    buildingBlockCategories,
    error,
    loading,
    selectedCategory,
    setLocale,
    getBuildingBlockCategories,
    getBuildingBlockCategory,
    findBuildingBlockCategory,
    banner,
  };
});

interface BlockData {
  slug: string;
  translations: Array<{
    languages_code: string;
    title: string;
    description: string;
  }>;
}

function parseBlockData({ slug, translations }: BlockData) {

  const item = {
    slug: mapCategory(slug),
    title: {} as Record<string, string>,
    description: {} as Record<string, string>,
  };

  translations.forEach(({ languages_code, title, description }) => {
    item.title[languages_code] = title;
    item.description[languages_code] = description;
  });

  return item;
}
