export default defineNuxtRouteMiddleware(async (to, from) => {
    const { $indexStore } = useNuxtApp()

    if (!$indexStore.auth.isAuthenticated && to.name !== "auth/login") {
        return navigateTo("/auth/login", { replace: true })
    }
})
