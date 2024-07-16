import { defineStore } from "pinia"
import { type Userinfo } from "../structure/interface"

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

            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem("token", token)
        },

        logout() {
            this.isAuthenticated = false
            this.user = {
                email: "",
                id: 0,
                username: "",
            }
            localStorage.removeItem("user")
        },

        checkAuth() {
            const userString = localStorage.getItem("user")

            if (userString) {
                const user = JSON.parse(userString)
                this.isAuthenticated = true
                this.user = user
            }
        },
    },
})
