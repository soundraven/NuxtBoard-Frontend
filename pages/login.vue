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

const config = useRuntimeConfig()
const api = config.public.apiBaseUrl

const userinfo = object({
    email: string().email("Invalid email!").required("Required"),
    password: string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
})

type Userinfo = InferType<typeof userinfo>

const form: Userinfo = reactive({
    email: "",
    password: "",
})

interface LoginResult {
    status: number
    message: string
}

const onSubmit = async () => {
    const payload = { email: form.email, password: form.password }
    const loginResult: LoginResult = await $fetch(`${api}/login`, {
        method: "POST",
        body: payload,
    })

    if (loginResult.status === 401) {
        alert("login failed")
    }

    if (loginResult.message === "success") {
        alert("login successed")
    } else {
        alert("unknown error")
    }
}
</script>
