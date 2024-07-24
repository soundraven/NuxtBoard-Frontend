import { Store } from "vuex"
import { Pinia } from "pinia"
import { useIndexStore } from "@/stores/index"

type IndexStoreType = ReturnType<typeof useIndexStore>

declare module "#app" {
    interface NuxtApp {
        $indexStore: IndexStoreType
    }
}

declare module "vue" {
    interface ComponentCustomProperties {
        $indexStore: IndexStoreType
    }
}
