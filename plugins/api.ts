import type { AxiosRequestConfig } from "axios";
import type { GeneralServerResponse } from "~/types/interface";

export default defineNuxtPlugin((nuxtApp) => {
  const apiGet = async <T>(
    path: string,
    params: Record<string, any> = {},
    config: AxiosRequestConfig = {}
  ): Promise<GeneralServerResponse<T>> => {
    const { $axios, $catchError } = useNuxtApp();

    try {
      const response = await $axios.get(path, {
        params,
        ...config,
      });

      return response.data;
    } catch (e: any) {
      $catchError(e);

      return {
        success: false,
        message: e.response?.data?.message || "An unexpected error occurred.",
        data: undefined as unknown as T,
      };
    }
  };

  const apiPost = async <T>(
    path: string,
    data: Record<string, any> = {},
    config: AxiosRequestConfig = {}
  ): Promise<GeneralServerResponse<T>> => {
    const { $axios, $catchError } = useNuxtApp();

    try {
      const response = await $axios.post(path, data, {
        ...config,
      });

      return response.data;
    } catch (e: any) {
      $catchError(e);

      return {
        success: false,
        message: e.response?.data?.message || "An unexpected error occurred.",
        data: undefined as unknown as T,
      };
    }
  };

  nuxtApp.provide("apiGet", apiGet);
  nuxtApp.provide("apiPost", apiPost);
});
