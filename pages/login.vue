<template>
    <UContainer>
        <UForm
            :schema="userinfo"
            :state="form"
            class="space-y-4"
            @submit="onSubmit"
        >
            <UFormGroup label="Email" name="email">
                <UInput v-model="form.email" />
            </UFormGroup>
            <UFormGroup label="Password" name="password">
                <UInput v-model="form.password" type="password" />
            </UFormGroup>

            <UButton type="submit">Submit!</UButton>
        </UForm>
    </UContainer>
</template>

<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const userinfo = object({
    email: string().email("Invalid email!").required("Required"),
    password: string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
})

type Userinfo = InferType<typeof userinfo>

const form = reactive({
    email: "",
    password: "",
})

interface LoginResult {
    message: string
}

const onSubmit = async (e: FormSubmitEvent<Userinfo>) => {
    // if (
    //     e.data.email === "1q2w3e4r@gmail.com" &&
    //     e.data.password === "1q2w3e4r"
    // ) {
    //     console.log(e, "login success!")
    // } else {
    //     console.log(e, "login fail...")
    // }
    const { pending, data: loginResult } = await useLazyAsyncData<LoginResult>(
        "loginResult",
        () => $fetch("https://nuxt-board-backend.vercel.app/api/userdata")
    )

    console.log((loginResult.value as { message: string }).message)
}
</script>
