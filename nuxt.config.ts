// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

export default defineNuxtConfig({
    devtools: { enabled: true },
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
