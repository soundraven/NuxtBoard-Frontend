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
                    <el-button @click="navigateTo('/register')"
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
import type { FormInstance, FormRules } from "element-plus"
import type { AxiosInstance } from "axios"

const { $axios } = useNuxtApp()

const authStore = useAuthStore()
const router = useRouter()

const rules: FormRules = {
    email: [
        { required: true, message: "Please input your email", trigger: "blur" },
        {
            type: "email",
            message: "Please input a valid email",
            trigger: "blur",
        },
    ],
    password: [
        {
            required: true,
            message: "Please input your password",
            trigger: "blur",
        },
        {
            validator: (rule, value, callback) => {
                if (value.length < 8) {
                    callback(
                        new Error("Password must be at least 8 characters")
                    )
                } else if (!/[A-Z]/.test(value)) {
                    callback(
                        new Error(
                            "Password must contain at least one uppercase letter"
                        )
                    )
                } else if (!/[a-z]/.test(value)) {
                    callback(
                        new Error(
                            "Password must contain at least one lowercase letter"
                        )
                    )
                } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    callback(
                        new Error(
                            "Password must contain at least one special character"
                        )
                    )
                } else {
                    callback()
                }
            },
            trigger: "change",
        },
    ],
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

        console.log(loginResult)

        //코드가 S가 아닐때 리턴 시키는 방식으로 수정
        if (loginResult.data.code === "S") {
            const user: Userinfo = loginResult.data.user
            const token: string = loginResult.data.token

            authStore.login(user, token)
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
</script>
