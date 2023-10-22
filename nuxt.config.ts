// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/ui', '@vueuse/nuxt', '@pinia/nuxt'],
  ui: {
    global: true,
    icons: ['ph', 'heroicons'],
  },
  colorMode: {
    preference: 'system',
    fallback: 'dark',
  },
  app: {
    head: {
      htmlAttrs: {
        class: 'dark',
      },
    },
  },

  vite: {
    clearScreen: false,
    envPrefix: ['VITE_', 'TAURI_'],

    server: {
      strictPort: true,
      host: '0.0.0.0',
      hmr: {
        host: '0.0.0.0',
        port: 5183,
      },
    },
  },
});
