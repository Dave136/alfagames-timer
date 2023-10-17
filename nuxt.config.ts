// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxt/ui", "@vueuse/nuxt"],
  ui: {
    global: true,
    icons: ["ph", "heroicons"],
  },
  colorMode: {
    preference: "system",
    fallback: "dark",
  },
  app: {
    head: {
      htmlAttrs: {
        class: "dark",
      },
    },
  },
});
