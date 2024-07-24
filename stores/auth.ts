import { defineStore } from "pinia"
import type { Userinfo } from "../types/interface"
import Cookies from "js-cookie"

interface State {
    isAuthenticated: boolean
    user: Userinfo
}

export const useAuthStore = defineStore<
    string,
    State,
    {},
    {
        login(user: Userinfo, token: string): void
        logout(): void
        checkAuth(): void
    }
>("auth", {
    state: (): State => ({
        isAuthenticated: false,
        user: {
            email: "",
            id: 0,
            username: "",
        },
    }),

    actions: {
        login(user: Userinfo, token: string) {
            this.isAuthenticated = true
            this.user = user

            sessionStorage.setItem("user", JSON.stringify(user))
            Cookies.set("token", token, { expires: 7 })
        },

        logout() {
            this.isAuthenticated = false
            this.user = {
                email: "",
                id: 0,
                username: "",
            }

            sessionStorage.removeItem("user")
            Cookies.remove("token")
        },

        checkAuth() {
            const userString = sessionStorage.getItem("user")

            if (userString) {
                const user = JSON.parse(userString)
                this.isAuthenticated = true
                this.user = user
            }
        },
    },
})
