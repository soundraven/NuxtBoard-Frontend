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
        setUsername(): void
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
            navigateTo("/")
        },

        checkAuth() {
            const userString = sessionStorage.getItem("user")

            if (userString) {
                const user = JSON.parse(userString)
                this.isAuthenticated = true
                this.user = user
            }
        },

        async setUsername() {
            const { $axios } = useNuxtApp()
            const token = Cookies.get("token")

            try {
                const result = await $axios.get("users/me", {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })

                this.user.username = result.data.user.username
                sessionStorage.setItem("user", JSON.stringify(this.user))
            } catch (error: any) {
                if (error.data && error.data.code === "E") {
                    alert(
                        `errorCode: ${error.data.errorCode}, ${error.data.message}`
                    )
                } else {
                    alert("Unknown error occurred. Please check and try again.")
                }
            }
        },
    },
})
