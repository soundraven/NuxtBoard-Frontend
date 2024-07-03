import { defineNuxtPlugin } from "#app"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"

export default defineNuxtPlugin((nuxtApp) => {
    const app = nuxtApp.vueApp
    app.use(ElementPlus)
})
