export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated && to.name !== "login") {
        return navigateTo("/login")
    }
})
