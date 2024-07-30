<template>
    <div class="flex justify-center">
        <el-card style="max-width: 480px">
            <template #header>
                <div class="card-header">
                    <span>사용자 정보 수정을 위한 공간</span>
                    <el-button type="warning" @click="dialogVisible = true"
                        >회원탈퇴
                    </el-button>
                    <el-dialog
                        v-model="dialogVisible"
                        title="Account Delete"
                        width="500"
                        :before-close="handleClose"
                    >
                        <span>Deleting your account is irreversible</span>
                        <template #footer>
                            <div class="dialog-footer">
                                <el-button @click="dialogVisible = false"
                                    >Cancel</el-button
                                >
                                <el-button type="danger" @click="deactivate">
                                    Confirm
                                </el-button>
                            </div>
                        </template>
                    </el-dialog>
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
import type { Userinfo, ApiResponse } from "@/types/interface"
import type { AxiosInstance, AxiosResponse } from "axios"
import Cookies from "js-cookie"

definePageMeta({
    middleware: "auth",
})

const config = useRuntimeConfig()
const api = config.public.apiBaseUrl

const router = useRouter()

const { $axios, $indexStore } = useNuxtApp()

const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
    ElMessageBox.confirm("Are you sure to close this dialog?")
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}

const deactivate = async () => {
    try {
        const userJson = sessionStorage.getItem("user")
        const token = Cookies.get("token")

        if (!userJson || !token) {
            alert("Userinfo or token is missing")
            $indexStore.auth.logout()
            return
        }

        const user: Userinfo = JSON.parse(userJson)

        const deactivateResult: AxiosResponse = await $axios.post(
            "/users/deactivate", //나중에 한 파일에서 import해오도록 수정
            {
                user: user,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        console.log(deactivateResult.data)

        if (deactivateResult.data.code === "S") {
            alert("Account successfully deactivated")
            $indexStore.auth.logout()
            dialogVisible.value = false
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
