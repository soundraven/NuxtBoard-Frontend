<template>
    <div class="h-screen flex justify-center">
        <el-card
            :class="{ 'opacity-0': !showCard, 'opacity-100': showCard }"
            class="w-[600px] h-[320px] flex justify-center items-center my-auto p-[40px] transition-opacity duration-1000 ease-in-out"
        >
            <el-form
                :model="form"
                :rules="rules"
                ref="loginForm"
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
                <div class="flex justify-center items-center">
                    <el-button type="primary" @click="submitForm"
                        >로그인</el-button
                    >
                    <el-button @click="navigateTo('/auth/register')"
                        >회원가입</el-button
                    >
                    <el-button>비밀번호 찾기</el-button>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import type { Userinfo, ApiResponse } from "@/types/interface.d.ts"
import type { FormInstance } from "element-plus"
import type { AxiosInstance } from "axios"
import rules from "@/utils/formRules"

const router = useRouter()
const { $axios, $indexStore } = useNuxtApp()

const loginForm = ref<FormInstance | null>(null)

const form: Userinfo = reactive({
    email: "",
    password: "",
})

const submitForm = async () => {
    if (!loginForm.value) return

    try {
        await loginForm.value.validate()
        onSubmit()
    } catch (error) {
        alert("Validation failed")
    }
}

const onSubmit = async () => {
    try {
        const loginResult = await $axios.post("/users/login", {
            user: form,
        })

        //코드가 S가 아닐때 리턴 시키는 방식으로 수정
        if (loginResult.data.code === "S") {
            const user: Userinfo = loginResult.data.user
            const token: string = loginResult.data.token

            $indexStore.auth.login(user, token)
            router.push("/")
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
