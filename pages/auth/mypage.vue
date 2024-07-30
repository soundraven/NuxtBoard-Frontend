<template>
    <el-container
        class="w-full h-[800px] flex flex-col justify-center pt-[6px]"
    >
        <el-container
            class="max-w-[1000px] h-full flex flex-row border-2 border-green-400 p-[6px]"
        >
            <el-header
                class="w-full h-[120px] border-2 border-blue-400 p-[6px]"
            >
                <el-button
                    type="primary"
                    v-if="$indexStore.auth.user.username === ''"
                    >Please set your username</el-button
                >
                <span v-else>
                    {{ $indexStore.auth.user.username }}'s mypage</span
                ></el-header
            >
            <el-tabs
                v-model="activeName"
                class="h-full pt-[6px]"
                @tab-click="handleClick"
                tab-position="left"
            >
                <el-tab-pane label="Home">내가 쓴 글과 댓글 모두</el-tab-pane>
                <el-tab-pane label="My post"
                    ><div>
                        <div class="flex justify-center">
                            <el-table
                                :data="list"
                                style="width: 100%; height: 100%"
                                :highlight-current-row="true"
                                class="mx-auto"
                            >
                                <el-table-column prop="id" label="ID" />
                                <el-table-column
                                    prop="board_id"
                                    label="게시판"
                                />
                                <el-table-column prop="title" label="제목">
                                    <template #default="scope">
                                        <a
                                            @click="goToPost(scope.row.id)"
                                            class="text-blue-500 cursor-pointer"
                                            >{{ scope.row.title }}</a
                                        >
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="registered_date"
                                    label="작성일자"
                                />
                            </el-table>
                        </div></div
                ></el-tab-pane>
                <el-tab-pane label="My comment"
                    ><div>내가 쓴 댓글</div></el-tab-pane
                >
                <el-tab-pane label="Resign"
                    ><el-button type="warning" @click="dialogVisible = true"
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
                </el-tab-pane>
            </el-tabs>
        </el-container>
        <el-aside
            style="padding: 6px"
            class="w-[280px] min-h-[550px] flex flex-col items-center border-2 border-red-400 p-[10px] ml-[6px]"
        >
            <Sidebar />
        </el-aside>
    </el-container>
</template>
<script setup lang="ts">
import type { Userinfo, ApiResponse } from "@/types/interface"
import type { AxiosInstance, AxiosResponse } from "axios"
import Cookies from "js-cookie"

definePageMeta({
    middleware: "auth",
})

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

const currentPage: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(20)
const totalCount: Ref<number> = ref(0)

const list: Ref = ref([])

const getPostList = async () => {
    try {
        console.log($indexStore.auth.user.id)
        //api 쓸때 페이지 있는 쪽에 다 쓰지 말고 어디서 함수 하나 선언해 두고 getPostList
        const postList = await $axios.get("/posts/list", {
            params: {
                currentPage: currentPage.value,
                pageSize: pageSize.value,
                registeredBy: $indexStore.auth.user.id,
            },
        })

        list.value = postList.data.postList
        totalCount.value = postList.data.totalCount
    } catch (error: any) {
        if (error.data && error.data.code === "E") {
            alert(`errorCode: ${error.data.errorCode}, ${error.data.message}`)
        } else {
            alert("Unknown error occurred. Please check and try again.")
        }
    }
}

watch(
    () => $indexStore.auth.user.id,
    (newId) => {
        if (newId) {
            getPostList()
        }
    }
)

onMounted(() => {
    getPostList()
})
</script>
