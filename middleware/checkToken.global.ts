import Cookies from "js-cookie"

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) {
        return
    }

    const { $indexStore } = useNuxtApp()

    if ($indexStore.auth.isAuthenticated) {
        console.log("check")
        const user = sessionStorage.getItem("user")
        const token = Cookies.get("token")

        if (!user || !token) {
            $indexStore.auth.logout()
            alert("validation failed, please login again")
            return navigateTo("/auth/login", { replace: true })
        }
    }
})
