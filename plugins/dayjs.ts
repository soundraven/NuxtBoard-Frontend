import type { Context } from "@nuxt/types"
import type { Inject } from "@nuxt/types/app"
import dayjs from "dayjs"

export default (context: Context, inject: Inject) => {
    inject("dayjs", dayjs)
}
