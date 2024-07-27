import { defineNuxtPlugin } from "#app"
import axios from "axios"

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    const api = axios.create({
        baseURL: baseURL,
        headers: {
            //조건 걸어서 토큰 있을시 넣도록
            "Content-Type": "application/json",
        },
        timeout: 10000,
    })

    nuxtApp.provide("axios", api)
})
