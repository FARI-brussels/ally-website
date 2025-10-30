import type { Locale } from "~/types/shared";
import type { Section, Page } from "~/types/parsers/Page";
import type { DirectusHero } from "~/types/directus/DirectusHero";
import { createDirectus, rest, readItem } from "@directus/sdk";

const client = createDirectus("https://fari-cms.directus.app").with(rest());

export const useStaticPageStore = defineStore("staticPage", () => {
  const pages = reactive({});

  async function getStaticPage(slug: string) {
    let hero = null;

    const page = await client.request(
      readItem("ally_static_page", slug, {
        fields: ["*.*"],
      }),
    );

    if (page.hero && page.hero.key) {
      hero = await client.request(
        readItem("ally_hero", page.hero.key, {
          fields: ["*.*", "*,image"],
        }),
      );
    }

    const { translations } = page;
    const parsed = parsePageData({ translations, slug, hero });
    pages[slug] = parsed;
    return page;
  }

  return { getStaticPage, pages };
});

function parsePageData({
  translations,
  slug,
  hero,
}: {
  translations: unknown[];
  slug: string;
  hero: DirectusHero;
}): Page {
  const page = {
    slug,
    hero: null,
    title: {} as { [locale in Locale]: string },
    sections: [] as Section[],
    content: [],
  } as Page;

  const pageHero = {
    media: "",
    title: {},
    description: {},
  };

  if (hero && hero.image.filename_disk) {
    pageHero.media = `https://fari-cms.directus.app/assets/${hero?.image.filename_disk}`;

    hero.translations.forEach(({ languages_code, title, description }) => {
      pageHero.title[languages_code] = title;
      pageHero.description[languages_code] = description;
    });

    page.hero = pageHero;
  }

  translations.forEach(
    ({ languages_code, title, section_1, section_2, section_3 }) => {
      [section_1, section_2, section_3].forEach(
        (section) =>
          section && page.content.push({ [languages_code]: section }),
      );
      page.title[languages_code] = title;
    },
  );

  return page;
}
