<template>
    <div>
        <NuxtLayout>
            <NuxtPage class="pt-[50px]" />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import type { Userinfo } from "./types/interface"
import Cookies from "js-cookie"

const authStore = useAuthStore()
const { $axios } = useNuxtApp()

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
        console.log(tryAutoLogin.data)

        const user = tryAutoLogin.data.user
        authStore.login(user, token)
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
