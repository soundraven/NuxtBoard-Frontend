<template>
    <el-container
        class="w-full h-[800px] flex flex-col justify-center pt-[6px]"
    >
        <el-container
            class="max-w-[1000px] h-full flex justify-center border-2 border-green-400 p-[6px]"
        >
            <el-form :model="form" class="w-[1000px] mx-auto mt-[6px]">
                <el-form-item>
                    <el-select
                        v-model="form.boardId"
                        placeholder="please select your board"
                    >
                        <el-option
                            v-for="(option, index) in options"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-input
                        v-model="form.title"
                        style="width: 100%"
                        maxlength="50"
                        show-word-limit
                        :rows="1"
                        type="textarea"
                        placeholder="Please input your title"
                    />
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="form.content"
                        style="width: 100%"
                        :autosize="{ minRows: 29, maxRows: 29 }"
                        type="textarea"
                        placeholder="Please input your content"
                    />
                </el-form-item>
                <el-button @click="onSubmit">글 수정완료 </el-button>
            </el-form>
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
import { catchError, errorHandler } from "~/utils/tryCatchFunctions"
import Cookies from "js-cookie"
import type { Postinfo } from "@/types/interface"
const { $axios, $indexStore } = useNuxtApp()
const route = useRoute()

definePageMeta({
    middleware: "auth",
})

const form = reactive({ title: "", content: "", boardId: 0, id: 0 })

const options = computed(() =>
    $indexStore.commoncode.boards.map((board) => ({
        value: board.id,
        label: board.name,
    }))
)

const postId: string = route.params.id as string

const getPostinfo = async (postId: string) => {
    try {
        const result = await $axios.get(`/posts/postinfo/${postId}`)

        if (!errorHandler(result)) return

        const postinfo: Postinfo = result.data.postinfo

        form.title = postinfo.title
        form.content = postinfo.content
        form.boardId = postinfo.board_id
        form.id = Number(postId)
    } catch (error: any) {
        catchError(error)
    }
}

onMounted(() => {
    getPostinfo(postId)
})

const onSubmit = async () => {
    try {
        const token = Cookies.get("token")

        if (!token) {
            alert("token is missing")
            $indexStore.auth.logout()
            return
        }

        const result = await $axios.post(
            "/posts/edit",
            {
                post: form,
                user: $indexStore.auth.user,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!errorHandler(result)) return

        ElMessage(`${result.data.message}`)
        navigateTo(`/post/${postId}`)
    } catch (error: any) {
        catchError(error)
    }
}
</script>
