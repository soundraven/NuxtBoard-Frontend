import type { Userinfo, ApiResponse } from "../types/interface"

const config = useRuntimeConfig()
const api = config.public.apiBaseUrl

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()
    console.log("phase01")

    if (authStore.isAuthenticated) {
        console.log("phase02")
        const userJson = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (!userJson || !token) {
            alert("Userinfo or token is missing")
            authStore.logout
            return navigateTo("/")
        }

        try {
            console.log("phase03")
            const user = JSON.parse(userJson)

            const checkAuth: ApiResponse = await $fetch(`${api}/validate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    user: user,
                },
            })

            console.log("phase04")
            if (checkAuth.code === "F") {
                alert("Auth failed")
            } else {
                return
            }
        } catch (error: any) {
            if (error.data && error.data.code === "E") {
                alert(
                    `errorCode: ${error.data.errorCode}, ${error.data.message}`
                )
            } else {
                alert("Unknown error occurred. Please check and try again.")
            }
        }
    }
})
