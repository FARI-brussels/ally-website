// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  }, //temporary workaround for a bug
  css: ["~/assets/scss/main.scss"],
  modules: [
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
  ],
  runtimeConfig: {
    public: {
      workshopFormUrl: process.env.NUXT_PUBLIC_WORKSHOP_FORM_URL,
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || ''
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
        },
      ],
    },
  },
  // typescript: {
  //   typeCheck: true
  // }
});
