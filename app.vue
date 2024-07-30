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

const { $axios, $indexStore } = useNuxtApp()

const autoLogin = async () => {
    const token = Cookies.get("token")
    console.log(token)

    if (!token) return

    try {
        const tryAutoLogin = await $axios.get("users/me", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })

        const user = tryAutoLogin.data.user
        $indexStore.auth.login(user, token)
    } catch (error: any) {
        if (error.data && error.data.code === "E") {
            alert(`errorCode: ${error.data.errorCode}, ${error.data.message}`)
        } else {
            alert("Unknown error occurred. Please check and try again.")
        }
    }
}

onMounted(() => {
    if (process.server) return
    autoLogin()
    console.log("Component has been mounted")
})
</script>
