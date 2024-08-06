import type { AxiosResponse } from "axios"

declare module "#app" {
    interface NuxtApp {
        $catchError: (error: any) => void
        $errorHandler: (result: AxiosResponse) => boolean
    }
}

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $catchError: (error: any) => void
        $errorHandler: (result: AxiosResponse) => boolean
    }
}

export {}
