// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.VITE_API_BASE_URL,
    },
  },

  css: ["@/assets/css/tailwind.css", "element-plus/dist/index.css"],

  vite: {
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
  },

  plugins: [
    "~/plugins/element-plus.ts",
    "~/plugins/axios.ts",
    "~/plugins/indexStore.ts",
    "~/plugins/dayjs.ts",
    "~/plugins/api.ts",
    { src: "~/plugins/ckeditor.client.ts", mode: "client" },
  ],
  modules: ["@nuxt/ui", "@element-plus/nuxt", "@pinia/nuxt"],

  typescript: {
    strict: true,
  },

  compatibilityDate: "2024-07-15",
});
