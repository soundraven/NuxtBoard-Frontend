<template>
    <LoginForm @onSubmit="onSubmit" />
</template>
<script setup lang="ts">
import type { Userinfo } from "@/structure/userinfo"

const onSubmit = async (e: Userinfo) => {
    if (e.email === "1q2w3e4r@gmail.com" && e.password === "1q2w3e4r") {
        await console.log(e, "success")
    } else {
        await console.log(e, "login fail")
    }
}
</script>
