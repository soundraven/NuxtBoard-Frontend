import { defineNuxtPlugin } from "#app";
import axios from "axios";
import Cookies from "js-cookie";
import refreshAccessToken from "~/utils/refreshAccessToken";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  const api = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  console.log("$axios 시작");

  api.interceptors.request.use(
    async (config) => {
      if (config.headers.requiresToken) {
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        if (!refreshToken) {
          ElMessage.error("Token is missing");
          const { $indexStore } = nuxtApp.vueApp.config.globalProperties;
          $indexStore.auth.logout();
          return Promise.reject(new Error("Token is missing"));
        }

        if (!accessToken) {
          const newAccessToken = await refreshAccessToken(refreshToken);
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } else {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  //axios onResponse, onRequest, onError등으로 에러를 캐치할 수 있음
  //nuxt/Axios 라는게 있음
  //응답시작할때 화면로딩키고 다되면 끄고 그걸 onResponse로 관리
  nuxtApp.provide("axios", api);
});
