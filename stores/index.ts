import { defineStore } from "pinia"
import { useAuthStore } from "./auth"
import { useCommoncodeStore } from "./commoncode"

export const useIndexStore = defineStore("index", {
    state: () => ({}),
    getters: {
        auth() {
            return useAuthStore()
        },

        commoncode() {
            return useCommoncodeStore()
        },
    },
})
