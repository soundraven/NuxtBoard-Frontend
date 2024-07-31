<template>
    <div class="h-screen flex justify-center">
        <el-card
            :class="{ 'opacity-0': !showCard, 'opacity-100': showCard }"
            class="w-[600px] h-[320px] flex justify-center items-center my-auto p-[40px] transition-opacity duration-1000 ease-in-out"
        >
            <el-form
                :model="form"
                :rules="rules"
                ref="registerForm"
                label-width="auto"
                class="flex flex-col justify-center items-center"
            >
                <el-form-item label="Email" prop="email" class="w-full">
                    <el-input type="email" v-model="form.email" />
                </el-form-item>
                <el-form-item label="Password" prop="password" class="w-full">
                    <el-input
                        type="password"
                        v-model="form.password"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="Username" prop="username" class="w-full">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-button type="primary" @click="submitForm"
                    >회원가입</el-button
                >
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { catchError, errorHandler } from "~/utils/tryCatchFunctions"
import type { Userinfo } from "@/types/interface"
import type { FormInstance } from "element-plus"
import rules from "@/utils/formRules"
import type { AxiosResponse } from "axios"

const { $axios } = useNuxtApp()

const registerForm = ref<FormInstance | null>(null)

const form: Userinfo = reactive({
    email: "",
    password: "",
    username: "",
})

const submitForm = async () => {
    if (!registerForm.value) return

    try {
        await registerForm.value.validate()
        onSubmit()
    } catch (error) {
        alert("Validation failed")
    }
}

const onSubmit = async () => {
    try {
        const registResult: AxiosResponse = await $axios.post(
            "/users/register",
            {
                user: form,
            }
        )

        if (!errorHandler(registResult)) return

        ElMessage(`${registResult.data.message}`)
        navigateTo("/")
    } catch (error: any) {
        catchError(error)
    }
}

const showCard: Ref<Boolean> = ref(false)

const toggleCard = () => {
    showCard.value = !showCard.value
}

onMounted(() => {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toggleCard()
        })
    })
})
</script>
