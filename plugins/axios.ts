import { defineNuxtPlugin } from "#app"
import Cookies from "js-cookie"
import axios from "axios"

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    const api = axios.create({
        baseURL: baseURL,
        headers: {
            "Content-Type": "application/json",
        },
        timeout: 10000,
    })

    nuxtApp.provide("axios", api)
})
