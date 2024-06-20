// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

export default defineNuxtConfig({
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.VITE_API_BASE_URL,
        },
    },
    css: ["@/assets/css/tailwind.css"],
    vite: {
        css: {
            postcss: {
                plugins: [tailwindcss(), autoprefixer()],
            },
        },
    },
    modules: ["@nuxt/ui"],

    typescript: {
        strict: true,
    },
})
