import type { GeneralServerResponse } from "~/types/interface";
import type { AxiosRequestConfig } from "axios";

declare module "#app" {
  interface NuxtApp {
    $apiGet: <T>(
      path: string,
      params?: Record<string, any>,
      config?: AxiosRequestConfig
    ) => Promise<GeneralServerResponse<T>>;

    $apiPost: <T>(
      path: string,
      data?: Record<string, any>,
      config?: AxiosRequestConfig
    ) => Promise<GeneralServerResponse<T>>;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $apiGet: <T>(
      path: string,
      params?: Record<string, any>,
      config?: AxiosRequestConfig
    ) => Promise<GeneralServerResponse<T>>;

    $apiPost: <T>(
      path: string,
      data?: Record<string, any>,
      config?: AxiosRequestConfig
    ) => Promise<GeneralServerResponse<T>>;
  }
}
