export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $indexStore } = useNuxtApp();
  if (process.client) {
    if (!sessionStorage.getItem("user") && to.name !== "auth/login") {
      return navigateTo("/auth/login", { replace: true });
    }
  }
});
