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
    { login(user: Userinfo): void; logout(): void; checkAuth(): void }
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
        login(user: Userinfo) {
            this.isAuthenticated = true
            this.user = user
            localStorage.setItem("user", JSON.stringify(user))
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
