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
                    @click="setUsernameVisible = true"
                    >Please set your username</el-button
                >
                <span v-else>
                    {{ $indexStore.auth.user.username }}'s mypage</span
                >
                <el-dialog
                    v-model="setUsernameVisible"
                    title="Set your username"
                    width="500"
                    :before-close="handleClose"
                >
                    <el-input
                        v-model="username"
                        style="width: 300px; margin-left: 99px"
                        maxlength="12"
                        show-word-limit
                        :rows="1"
                        type="textarea"
                        placeholder="Please input your username"
                    />
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="setUsernameVisible = false"
                                >Cancel</el-button
                            >
                            <el-button type="primary" @click="setUsername">
                                Confirm
                            </el-button>
                        </div>
                    </template>
                </el-dialog>
            </el-header>
            <el-tabs class="h-full pt-[6px]" tab-position="left">
                <el-tab-pane label="Home"> </el-tab-pane>
                <el-tab-pane label="My post">
                    <div class="flex justify-center">
                        <el-table
                            :data="postList"
                            style="width: 100%; height: 100%"
                            :highlight-current-row="true"
                            class="mx-auto"
                        >
                            <el-table-column prop="id" label="ID" />
                            <el-table-column prop="board_id" label="게시판" />
                            <el-table-column prop="title" label="제목">
                                <template #default="scope">
                                    <a
                                        @click="
                                            navigateTo(`/post/${scope.row.id}`)
                                        "
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
                    </div>
                </el-tab-pane>
                <el-tab-pane label="My comment"
                    ><div>
                        <div class="flex justify-center">
                            <el-table
                                :data="commentList"
                                style="width: 100%; height: 100%"
                                :highlight-current-row="true"
                                class="mx-auto"
                            >
                                <el-table-column prop="id" label="ID" />
                                <el-table-column prop="content" label="내용">
                                    <template #default="scope">
                                        <a
                                            @click="
                                                navigateTo(
                                                    `/post/${scope.row.post_id}`
                                                )
                                            "
                                            class="text-blue-500 cursor-pointer"
                                            >{{ scope.row.content }}</a
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
import type { Userinfo } from "@/types/interface"
import type { AxiosResponse } from "axios"
import Cookies from "js-cookie"

definePageMeta({
    middleware: "auth",
})

const router = useRouter()

const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp()

const dialogVisible: Ref<boolean> = ref(false)
const setUsernameVisible: Ref<boolean> = ref(false)

const username: Ref<string> = ref("")

const setUsername = async () => {
    try {
        const userJson = sessionStorage.getItem("user")
        const token = Cookies.get("token")

        if (!userJson || !token) {
            alert("Userinfo or token is missing")
            $indexStore.auth.logout()
            return
        }

        const setUsernameResult: AxiosResponse = await $axios.post(
            "/users/setUsername",
            {
                user: $indexStore.auth.user,
                username: username.value,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!$errorHandler(setUsernameResult)) return

        ElMessage("Username successfully set")
        setUsernameVisible.value = false
        $indexStore.auth.setUsername()
    } catch (error: any) {
        $catchError(error)
    }
}

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
            "/users/deactivate",
            {
                user: user,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!$errorHandler(deactivateResult)) return

        ElMessage("Account successfully deactivated")
        $indexStore.auth.logout()
        dialogVisible.value = false
        router.push("/")
    } catch (error: any) {
        $catchError(error)
    }
}

const currentPage: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(20)
const totalCount: Ref<number> = ref(0)

const postList: Ref = ref([])
const commentList: Ref = ref([])

const getPostList = async () => {
    console.log("테스트")
    console.log(sessionStorage.getItem("user"))
    const token = Cookies.get("token")
    //세션스토리지에서 스토어로 긁어오는거 적용하면 문제해결

    try {
        const postResult: AxiosResponse = await $axios.get("/posts/list", {
            params: {
                currentPage: currentPage.value,
                pageSize: pageSize.value,
                registeredBy: $indexStore.auth.user.id,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        //promise.all 쓰면됨
        const commentResult: AxiosResponse = await $axios.get(
            `/comments/myCommentList/${$indexStore.auth.user.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!$errorHandler(postResult)) return
        if (!$errorHandler(commentResult)) return

        postList.value = postResult.data.postList
        totalCount.value = postResult.data.totalCount
        commentList.value = commentResult.data.commentList
    } catch (error: any) {
        $catchError(error)
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
