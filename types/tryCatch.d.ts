import type { AxiosResponse } from "axios";
import type { GeneralServerResponse } from "~/types/interface";

declare module "#app" {
  interface NuxtApp {
    $catchError: (error: any) => void;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $catchError: (error: any) => void;
  }
}

export {};
