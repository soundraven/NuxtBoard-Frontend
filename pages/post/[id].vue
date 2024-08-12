<template>
    <el-container
        v-if="postinfo != undefined"
        class="w-full flex flex-col justify-center pt-[6px]"
    >
        <el-container
            class="max-w-[1000px] h-full flex justify-center border-2 border-green-400 p-[6px]"
        >
            <el-card class="w-[1024px] min-h-[800px] mx-auto">
                <template #header>
                    <div>
                        {{ postinfo.title }}
                    </div>
                </template>
                <div class="min-h-[500px]">
                    {{ postinfo.content }}
                    //v-html 써가지고 불러와야 이미지 등도 불러옴
                </div>
                <div>
                    <el-button type="primary" @click="handleLike(true)">
                        <div>추천</div>
                        <div>{{ likeinfo.total_likes }}</div>
                    </el-button>
                    <el-button type="danger" @click="handleLike(false)">
                        <div>비추천</div>
                        <div>{{ likeinfo.total_dislikes }}</div>
                    </el-button>
                    <el-button type="danger" @click="report">
                        <div>신고</div>
                        <div>{{ postinfo.report }}</div>
                    </el-button>
                </div>
                <template #footer>
                    <el-list>
                        <el-list-item
                            v-for="(comment, index) in commentList"
                            :key="comment.id"
                        >
                            <div
                                class="h-[50px] border-2 border-green-400 p-[6px] mb-[6px] cursor-pointer"
                                @click="onReplyArea(comment.id)"
                            >
                                <div>
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
                                        type="primary"
                                        @click.stop="
                                            onEditArea(
                                                comment.id,
                                                comment.content
                                            )
                                        "
                                        class="z-10"
                                    >
                                        수정
                                    </el-button>
                                    <el-button
                                        v-if="
                                            comment.registered_by ===
                                            $indexStore.auth.user.id
                                        "
                                        type="danger"
                                        @click.stop="deleteComment(comment.id)"
                                    >
                                        삭제
                                    </el-button>
                                </div>
                            </div>
                            <div
                                class="mt-[10px]"
                                v-if="
                                    editCommentInputArea &&
                                    comment.id === editedCommentNum
                                "
                            >
                                <el-input
                                    v-model="editedComment"
                                    style="width: 100%"
                                    :rows="2"
                                    type="textarea"
                                    placeholder="Please input your comment"
                                />
                                <el-button @click="editComment"
                                    >댓글 수정 완료</el-button
                                >
                            </div>
                            <div
                                v-for="(reply, index) in comment.replies"
                                :key="reply.id"
                                class="h-[50px] border-2 border-green-400 p-[6px] ml-[20px] mb-[6px]"
                            >
                                <span v-if="!reply.username" class="mr-[6px]"
                                    >익명</span
                                >
                                <span v-else class="mr-[6px]">{{
                                    reply.username
                                }}</span
                                ><span>{{ reply.content }}</span>
                            </div>
                            <div
                                class="mt-[10px]"
                                v-if="
                                    replyInputArea &&
                                    comment.id === replyComment
                                "
                            >
                                <el-input
                                    v-model="reply"
                                    style="width: 100%"
                                    :rows="2"
                                    type="textarea"
                                    placeholder="답글을 입력하세요"
                                />
                                <el-button @click="writeReply(comment.id)"
                                    >답글 작성 완료</el-button
                                >
                            </div>
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
import type { Postinfo, Commentinfo, Likeinfo } from "~/types/interface"
import type { AxiosResponse } from "axios"
const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp()

const route = useRoute()
const router = useRouter()

const postId: string = route.params.id as string
const postinfo: Ref<Postinfo | undefined> = ref(undefined)
const likeinfo: Ref<Likeinfo> = ref({})

const commentList: Ref<Commentinfo[]> = ref([])
const comment: Ref<string> = ref("")
const editedComment: Ref<string> = ref("")
const editedCommentNum: Ref<number> = ref(0)
const editCommentInputArea: Ref<boolean> = ref(false)
const reply: Ref<string> = ref("")
const replyInputArea: Ref<boolean> = ref(false)
const replyComment: Ref<number> = ref(0)

onMounted(() => {
    getPostinfo()
})

const onReplyArea = (commentId: number) => {
    replyInputArea.value = !replyInputArea.value
    replyComment.value = commentId
}

const onEditArea = (commentId: number, content: string) => {
    editCommentInputArea.value = !editCommentInputArea.value
    editedCommentNum.value = commentId
    editedComment.value = content
}

const getPostinfo = async () => {
    //게시글이랑 댓글을 따로따로 불러오도록 쪼개기
    try {
        const [postResponse, commentResponse]: [AxiosResponse, AxiosResponse] =
            await Promise.all([
                $axios.get(`/posts/postinfo/${postId}`),
                $axios.get(`/comments/commentList/${postId}`),
            ])

        if (!$errorHandler(postResponse) || !$errorHandler(commentResponse))
            return

        if (postResponse.data.postinfo.active === 0) {
            router.back()
        }

        postinfo.value = postResponse.data.postinfo
        likeinfo.value = postResponse.data.likeinfo
        commentList.value = commentResponse.data.commentList
        console.log(likeinfo.value)
    } catch (error: any) {
        $catchError(error)
    }
}

const writeComment = async () => {
    try {
        const result: AxiosResponse = await $axios.post(
            "/comments/write",
            {
                comment: comment.value,
                user: $indexStore.auth.user,
                postId: postId,
            },
            {
                headers: {
                    requiresToken: true,
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

const editComment = async () => {
    try {
        const result: AxiosResponse = await $axios.post(
            "/comments/edit",
            {
                comment: editedComment.value,
                user: $indexStore.auth.user,
                commentId: editedCommentNum.value,
            },
            {
                headers: {
                    requiresToken: true,
                },
            }
        )

        if (!$errorHandler(result)) return

        ElMessage(`${result.data.message}`)
        editedComment.value = ""
        editedCommentNum.value = 0
        editCommentInputArea.value = false
        getPostinfo()
    } catch (error: any) {
        $catchError(error)
    }
}

const writeReply = async (commentId: number) => {
    try {
        const result: AxiosResponse = await $axios.post(
            "/comments/write",
            {
                reply: reply.value,
                user: $indexStore.auth.user,
                commentId: commentId,
                postId: postId,
            },
            {
                headers: {
                    requiresToken: true,
                },
            }
        )

        if (!$errorHandler(result)) return

        ElMessage(`${result.data.message}`)
        reply.value = ""
        replyInputArea.value = false
        getPostinfo()
    } catch (error: any) {
        $catchError(error)
    }
}

const deletePost = async () => {
    try {
        const deletePostResult: AxiosResponse = await $axios.post(
            `/posts/delete`,
            {
                user: $indexStore.auth.user,
                postId: postId,
            },
            {
                headers: {
                    requiresToken: true,
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

const deleteComment = async (commentId: number) => {
    try {
        const deleteCommentResult: AxiosResponse = await $axios.post(
            `/comments/delete`,
            {
                user: $indexStore.auth.user,
                commentId: commentId,
            },
            {
                headers: {
                    requiresToken: true,
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

const handleLike = async (liked: boolean) => {
    if (liked === true) {
        try {
            const like: AxiosResponse = await $axios.post(
                "/posts/likes/like",
                {
                    user: $indexStore.auth.user,
                    postId: postId,
                },
                {
                    headers: {
                        requiresToken: true,
                    },
                }
            )

            if (!$errorHandler(like)) return
            ElMessage("Successfully liked")
            getPostinfo()
        } catch (error: any) {
            $catchError(error)
        }
    } else {
        try {
            const dislike: AxiosResponse = await $axios.post(
                "/posts/likes/dislike",
                {
                    user: $indexStore.auth.user,
                    postId: postId,
                },
                {
                    headers: {
                        requiresToken: true,
                    },
                }
            )

            if (!$errorHandler(dislike)) return
            ElMessage("Successfully liked")
            getPostinfo()
        } catch (error: any) {
            $catchError(error)
        }
    }
}

const report = async () => {
    try {
        const reportResult: AxiosResponse = await $axios.post(
            `/posts/report`,
            {
                user: $indexStore.auth.user,
                postId: postId,
            },
            {
                headers: {
                    requiresToken: true,
                },
            }
        )

        if (!$errorHandler(reportResult)) return

        ElMessage(reportResult.data.message)
        getPostinfo()
    } catch (error: any) {
        $catchError(error)
    }
}
</script>
