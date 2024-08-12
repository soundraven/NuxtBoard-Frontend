import { defineStore } from "pinia"
import type { UserInfo } from "../types/interface"
import Cookies from "js-cookie"

interface State {
    isAuthenticated: boolean
    user: UserInfo
}

export const useAuthStore = defineStore<
    string,
    State,
    {},
    {
        login(user: UserInfo, refreshToken: string, accessToken: string): void
        logout(): void
        autoLogin(user: UserInfo): void
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
        login(user, refreshToken, accessToken) {
            this.isAuthenticated = true
            this.user = user

            sessionStorage.setItem("user", JSON.stringify(user))
            Cookies.set("refreshToken", refreshToken, { expires: 7 })
            Cookies.set("accessToken", accessToken, { expires: 15 / 1440 })
        },

        logout() {
            this.isAuthenticated = false
            this.user = {
                email: "",
                id: 0,
                username: "",
            }

            sessionStorage.removeItem("user")
            Cookies.remove("refreshToken")
            Cookies.remove("accessToken")
            navigateTo("/")
        },

        async autoLogin() {
            const { $axios, $catchError, $errorHandler } = useNuxtApp()
            try {
                const result = await $axios.get("users/me", {
                    headers: {
                        requiresToken: true,
                    },
                })

                if (!$errorHandler(result)) return

                this.isAuthenticated = true
                this.user = result.data.user
                Cookies.set("accessToken", result.data.accessToken)
            } catch (error: any) {
                $catchError(error)
            }
        },

        async setUsername() {
            const { $axios, $catchError, $errorHandler } = useNuxtApp()

            try {
                const result = await $axios.get("users/me", {
                    headers: {
                        requiresToken: true,
                    },
                })

                if (!$errorHandler(result)) return

                this.user.username = result.data.user.username
                sessionStorage.setItem("user", JSON.stringify(this.user))
            } catch (error: any) {
                $catchError(error)
            }
        },
    },
})
