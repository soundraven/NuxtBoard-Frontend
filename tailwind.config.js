/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{vue,js,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
    ],

    darkMode: "class",
    theme: {
        extend: {
            colors: {},
        },
    },
    variants: {
        extend: {
            backgroundColor: ["dark"],
            textColor: ["dark"],
            borderColor: ["dark"],
        },
    },
    plugins: [],
}
