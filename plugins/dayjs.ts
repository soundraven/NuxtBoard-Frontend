import dayjs from "dayjs"
import { defineNuxtPlugin } from "#app"

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide("dayjs", dayjs)
})
