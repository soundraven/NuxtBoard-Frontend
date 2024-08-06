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
    //axios onResponse, onRequest, onError등으로 에러를 캐치할 수 있음
    //nuxt/Axios 라는게 있음
    //응답시작할때 화면로딩키고 다되면 끄고 그걸 onResponse로 관리
    nuxtApp.provide("axios", api)
})
