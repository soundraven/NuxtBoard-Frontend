<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import type { AxiosResponse } from "axios"
import type { Userinfo } from "./types/interface"
import Cookies from "js-cookie"
import { catchError, errorHandler } from "~/utils/tryCatchFunctions"

const { $axios, $indexStore } = useNuxtApp()

const autoLogin = async () => {
    const token = Cookies.get("token")

    if (!token) return

    try {
        const tryAutoLogin: AxiosResponse = await $axios.get("users/me", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })

        const user: Userinfo = tryAutoLogin.data.user
        $indexStore.auth.login(user, token)
    } catch (error: any) {
        catchError(error)
    }
}

onMounted(() => {
    if (process.server) return
    autoLogin()
    console.log("Component has been mounted")
})
</script>
