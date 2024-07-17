<template>
    <div>
        <NuxtLayout>
            <NuxtPage class="pt-[50px]" />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import type { Userinfo } from "./types/interface"

const authStore = useAuthStore()

onMounted(() => {
    if (process.server) return

    const userItem = localStorage.getItem("user")
    const tokenItem = localStorage.getItem("token")

    if (userItem && tokenItem) {
        const user: Userinfo = JSON.parse(userItem) as Userinfo
        const token: string = tokenItem

        authStore.login(user, token)
        alert("Auto login success")
    } else return

    console.log("Component has been mounted")
})
</script>
