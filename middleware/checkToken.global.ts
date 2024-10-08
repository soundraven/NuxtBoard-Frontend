import Cookies from "js-cookie";
import refreshAccessToken from "~/utils/refreshAccessToken";

export default defineNuxtRouteMiddleware(async () => {
  if (process.server) {
    return;
  }

  const { $indexStore } = useNuxtApp();

  if ($indexStore.auth.isAuthenticated) {
    const user = sessionStorage.getItem("user");
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (!user) {
      $indexStore.auth.logout();
      ElMessage.error("User info missing, Please login again.");
      return navigateTo("/auth/login", { replace: true });
    }

    if (!refreshToken) {
      $indexStore.auth.logout();
      ElMessage.error("Token is missing, Please login again");
      return navigateTo("/auth/login", { replace: true });
    }

    if (!accessToken) {
      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) Cookies.set("accessToken", newAccessToken);
      } catch (error) {
        $indexStore.auth.logout();
        ElMessage.error("Failed to refresh access token, Please login again.");
        return navigateTo("/auth/login", { replace: true });
      }
    }
  }
});
