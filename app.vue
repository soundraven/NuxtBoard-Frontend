<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import type { Userinfo } from "./types/interface"
import Cookies from "js-cookie"
import errorHandler from "~/utils/errorHandler"

const { $axios, $indexStore } = useNuxtApp()

const autoLogin = async () => {
    const token = Cookies.get("token")

    if (!token) return

    try {
        const tryAutoLogin = await $axios.get("users/me", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })

        const user: Userinfo = tryAutoLogin.data.user
        const expires: number = tryAutoLogin.data.expires
        $indexStore.auth.login(user, token)
    } catch (error: any) {
        errorHandler(error)
    }
}

onMounted(() => {
    if (process.server) return
    autoLogin()
    console.log("Component has been mounted")
})
</script>
