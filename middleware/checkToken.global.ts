import Cookies from "js-cookie"
import { errorHandler, catchError } from "~/utils/tryCatchFunctions"

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) {
        return
    }

    const { $axios, $indexStore } = useNuxtApp()

    if ($indexStore.auth.isAuthenticated) {
        console.log("check")
        const user = sessionStorage.getItem("user")
        const token = Cookies.get("token")

        if (user && !token) {
            const userObject = JSON.parse(user)
            try {
                console.log(userObject)
                const response = await $axios.post("/users/createToken", {
                    user: userObject,
                })
                console.log(response)

                if (!errorHandler(response)) return

                const newToken = response.data.token
                Cookies.set("token", newToken, { expires: 1 })
            } catch (error: any) {
                catchError(error)
            }
        }

        if (!user && !token) {
            $indexStore.auth.logout()
            ElMessage("validation failed, please login again")
            return navigateTo("/auth/login", { replace: true })
        }
    }
})
