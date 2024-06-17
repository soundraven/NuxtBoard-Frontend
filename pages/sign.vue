<template>
    <LoginForm @onSubmit="onSubmit" />
</template>
<script setup lang="ts">
import type { Userinfo } from "@/structure/userinfo"

const onSubmit = async (e: Userinfo) => {
    await console.log(e, "sign in success")
}
</script>
