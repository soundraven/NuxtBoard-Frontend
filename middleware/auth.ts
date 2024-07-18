export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated && to.name !== "auth/login") {
        return navigateTo("/auth/login")
    }
})
