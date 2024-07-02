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
import { type ApiResponse } from "../structure/interface"

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

const onSubmit = async () => {
    try {
        const loginResult: ApiResponse = await $fetch(`${api}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: form,
        })

        if (loginResult.code === "S") {
            alert(`${loginResult.message}`)
        } else {
            alert("Unknown error")
        }
    } catch (error: any) {
        if (error.data && error.data.code === "E") {
            alert(`errorCode: ${error.data.errorCode}, ${error.data.message}`)
        } else {
            alert("Unknown error occurred. Please check and try again.")
        }
    }
}
</script>
