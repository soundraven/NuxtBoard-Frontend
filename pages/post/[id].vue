<template>
    <el-container class="w-full flex flex-col justify-center pt-[6px]">
        <el-container
            class="max-w-[1000px] h-full flex justify-center border-2 border-green-400 p-[6px]"
        >
            <el-card class="w-[1024px] min-h-[800px] mx-auto">
                <template #header>
                    <div>
                        {{ postinfo.title }}
                    </div>
                </template>
                <div class="min-h-[500px]">{{ postinfo.content }}</div>
                <template #footer>
                    <el-list>
                        <el-list-item
                            v-for="(comment, index) in commentList"
                            :key="comment.id"
                        >
                            <el-card>
                                <div class="comment-author">
                                    <span
                                        v-if="comment.username === ''"
                                        class="mr-[6px]"
                                        >익명</span
                                    >
                                    <span v-else class="mr-[6px]">{{
                                        comment.username
                                    }}</span
                                    ><span>{{ comment.content }}</span>
                                    <el-button
                                        v-if="
                                            comment.registered_by ===
                                            $indexStore.auth.user.id
                                        "
                                        type="danger"
                                        @click="deleteComment(comment.id)"
                                    >
                                        댓글 삭제
                                    </el-button>
                                </div>
                            </el-card>
                        </el-list-item>
                    </el-list>
                    <div v-if="$indexStore.auth.isAuthenticated">
                        <el-input
                            v-model="comment"
                            style="width: 100%"
                            :rows="5"
                            type="textarea"
                            placeholder="Please input your comment"
                        />
                        <el-button @click="writeComment"
                            >댓글 작성 완료</el-button
                        >
                    </div>
                </template>
            </el-card>
            <el-button
                v-if="$indexStore.auth.user.id === postinfo.registered_by"
                type="primary"
                @click="navigateTo(`/post/edit/${route.params.id}`)"
                >글수정</el-button
            >
            <el-button
                v-if="$indexStore.auth.user.id === postinfo.registered_by"
                type="danger"
                @click="deletePost"
                >글삭제</el-button
            >
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
import type { Postinfo, Commentinfo } from "~/types/interface"
import type { AxiosResponse } from "axios"
import Cookies from "js-cookie"
const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp()

const route = useRoute()

const postId: string = route.params.id as string
const postinfo: Ref<Postinfo> = ref({} as Postinfo)

const commentList: Ref<Commentinfo[]> = ref([] as Commentinfo[])
const comment: Ref<string> = ref("")

const getPostinfo = async () => {
    try {
        const postResponse: AxiosResponse = await $axios.get(
            `/posts/postinfo/${postId}`
        )
        const commentResponse: AxiosResponse = await $axios.get(
            `/comments/commentList/${postId}`
        )

        if (!$errorHandler(postResponse)) return
        if (!$errorHandler(commentResponse)) return

        postinfo.value = postResponse.data.postinfo
        commentList.value = commentResponse.data.commentList
    } catch (error: any) {
        $catchError(error)
    }
}

const deletePost = async () => {
    try {
        const token = Cookies.get("token")

        const deletePostResult: AxiosResponse = await $axios.post(
            `/posts/delete`,
            {
                user: $indexStore.auth.user,
                postId: postId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!$errorHandler(deletePostResult)) return

        ElMessage("Post successfully deleted")
        navigateTo("/")
    } catch (error: any) {
        $catchError(error)
    }
}

const writeComment = async () => {
    try {
        const token = Cookies.get("token")

        if (!token) {
            alert("token is missing")
            $indexStore.auth.logout()
            return
        }

        const result: AxiosResponse = await $axios.post(
            "/comments/write",
            {
                comment: comment.value,
                user: $indexStore.auth.user,
                postId: postId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!$errorHandler(result)) return

        ElMessage(`${result.data.message}`)
        comment.value = ""
        getPostinfo()
    } catch (error: any) {
        $catchError(error)
    }
}

const deleteComment = async (commentId: number) => {
    try {
        const token = Cookies.get("token")

        const deleteCommentResult: AxiosResponse = await $axios.post(
            `/comments/delete`,
            {
                user: $indexStore.auth.user,
                commentId: commentId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!$errorHandler(deleteCommentResult)) return

        ElMessage("Comment successfully deleted")
        getPostinfo()
    } catch (error: any) {
        $catchError(error)
    }
}

onMounted(() => {
    getPostinfo()
})
</script>
