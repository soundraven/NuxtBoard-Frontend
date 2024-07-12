<template>
    <div class="h-screen flex justify-center">
        <el-card
            :class="{ 'opacity-0': !showCard, 'opacity-100': showCard }"
            class="w-[600px] h-[320px] flex justify-center items-center my-auto p-[40px] transition-opacity duration-1000 ease-in-out"
        >
            <el-form :model="form" label-width="auto">
                <el-form-item label="Email">
                    <el-input v-model="form.email" />
                </el-form-item>
                <el-form-item label="Password">
                    <el-input v-model="form.password" />
                </el-form-item>
                <div flex justify-center items-center>
                    <el-button type="primary" @click="onSubmit"
                        >로그인</el-button
                    >
                    <el-button @click="navigateTo('/register')"
                        >회원가입</el-button
                    >
                </div>

                <el-button>비밀번호 찾기</el-button>
            </el-form>
        </el-card>
    </div>
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
