import { defineNuxtPlugin } from "#app"
import axios from "axios"

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const api = axios.create({
        baseURL: config.public.apiBaseUrl,
        headers: {
            "Content-Type": "application/json",
        },
        timeout: 10000,
    })

    nuxtApp.provide("axios", api)
})
