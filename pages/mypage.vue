<template>
    <div class="flex justify-center">
        <el-card style="max-width: 480px">
            <template #header>
                <div class="card-header">
                    <span>사용자 정보 수정을 위한 공간</span>
                    <el-button type="warning" @click="deactivate"
                        >회원탈퇴
                    </el-button>
                </div>
            </template>
            <template #default>
                <div>내가 쓴 글</div>
                <div>내가 쓴 댓글</div>
            </template>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import type { Userinfo, ApiResponse } from "../structure/interface"

const config = useRuntimeConfig()
const api = config.public.apiBaseUrl

const authStore = useAuthStore()
const router = useRouter()

definePageMeta({
    middleware: "auth",
})

const deactivate = async () => {
    try {
        const userJson = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (!userJson || !token) {
            alert("Userinfo or token is missing")
            return
        }

        const user = JSON.parse(userJson)

        const deactivateResult: ApiResponse = await $fetch(
            `${api}/users/deactivate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    user: user,
                },
            }
        )

        if (deactivateResult.code === "S") {
            alert("Account successfully deactivated")
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

onMounted(() => {})
</script>
