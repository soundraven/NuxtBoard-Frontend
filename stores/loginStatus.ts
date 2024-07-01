import { defineStore } from "pinia"

export const loginStore = defineStore("loginStatus", {
    state: () => ({
        count: 0,
    }),
    actions: {
        increment() {
            this.count++
        },
    },
})
