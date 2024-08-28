export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    if (!sessionStorage.getItem("user") && to.path !== "/auth/login") {
      return navigateTo("/auth/login", { replace: true });
    }
  }
});
