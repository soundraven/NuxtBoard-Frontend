<template>
    <el-container
        v-if="postInfo != undefined"
        class="w-screen flex flex-col justify-center"
    >
        <el-container class="max-w-[1000px] h-full flex justify-center">
            <el-card class="w-[1024px] min-h-[800px] mx-auto">
                <template #header>
                    <div>
                        {{ postInfo.title }}
                    </div>
                </template>
                <div class="min-h-[500px]">
                    {{ postInfo.content }}
                </div>
                <div class="w-full flex justify-center">
                    <el-button type="primary" @click="handleLike(true)">
                        <div>추천</div>
                        <div>{{ likeInfo.totalLikes }}</div>
                    </el-button>
                    <el-button type="danger" @click="handleLike(false)">
                        <div>비추천</div>
                        <div>{{ likeInfo.totalDislikes }}</div>
                    </el-button>
                </div>
                <el-button type="danger" @click="report">
                    <div>신고</div>
                    <div>{{ postInfo.report }}</div>
                </el-button>
                <template #footer>
                    <el-list>
                        <el-list-item
                            v-for="(comment, index) in commentList"
                            :key="comment.id"
                        >
                            <div
                                class="h-[70px] flex justify-between items-center border-[1px] border-[#E5EAF3] rounded shadow-sm p-[12px] mb-[12px] cursor-pointer"
                                :class="{
                                    'bg-[#66b1ff33]':
                                        (editCommentInputArea &&
                                            comment.id === editedCommentNum) ||
                                        (replyInputArea &&
                                            comment.id === replyComment),
                                }"
                                @click="onReplyArea(comment.id)"
                            >
                                <div>
                                    <span
                                        v-if="comment.userName === ''"
                                        class="mr-[6px]"
                                        >익명</span
                                    >
                                    <span v-else class="mr-[6px]">{{
                                        comment.userName
                                    }}</span
                                    ><span>{{ comment.content }}</span>
                                </div>
                                <div
                                    v-if="
                                        comment.registeredBy ===
                                        $indexStore.auth.user.id
                                    "
                                    class="flex space-x-2"
                                >
                                    <el-button
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
                                        type="danger"
                                        @click.stop="deleteComment(comment.id)"
                                    >
                                        삭제
                                    </el-button>
                                </div>
                            </div>

                            <div
                                class="h-auto border-[1px] border-[#E5EAF3] rounded shadow-sm p-[12px] mb-[12px]"
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
                                    >댓글 수정 완료
                                </el-button>
                            </div>
                            <div
                                v-for="(reply, index) in comment.replies"
                                :key="reply.id"
                                class="h-[70px] flex items-center border-[1px] border-[#E5EAF3] rounded shadow-sm p-[12px] ml-[30px] mb-[12px] cursor-pointer"
                                :class="{
                                    'bg-[#66b1ff33]':
                                        editedReplyInputArea &&
                                        reply.id === editedReplyNum,
                                }"
                            >
                                <div
                                    class="w-full flex justify-between items-center"
                                >
                                    <div>
                                        <span
                                            v-if="!reply.userName"
                                            class="mr-[6px]"
                                            >익명</span
                                        >
                                        <span v-else class="mr-[12px]">{{
                                            reply.userName
                                        }}</span
                                        ><span>{{ reply.content }}</span>
                                    </div>
                                    <div
                                        v-if="
                                            reply.registeredBy ===
                                            $indexStore.auth.user.id
                                        "
                                        class="flex space-x-2 items-center justify-center"
                                    >
                                        <el-button
                                            type="primary"
                                            style="my-auto"
                                            @click.stop="
                                                onEditReplyArea(
                                                    reply.id,
                                                    reply.content
                                                )
                                            "
                                        >
                                            수정
                                        </el-button>
                                        <el-button
                                            type="danger"
                                            @click.stop="
                                                deleteComment(comment.id)
                                            "
                                        >
                                            삭제
                                        </el-button>
                                    </div>
                                </div>
                                <ClientOnly>
                                    <teleport to="#replyEditPosition">
                                        <div
                                            v-if="
                                                editedReplyInputArea &&
                                                reply.id === editedReplyNum
                                            "
                                            class="h-auto border-[1px] border-[#E5EAF3] rounded shadow-sm p-[12px] ml-[30px] mb-[12x]"
                                        >
                                            <el-input
                                                v-model="editedReply"
                                                style="width: 100%"
                                                :rows="2"
                                                type="textarea"
                                                placeholder="답글을 수정하세요"
                                            />
                                            <el-button
                                                @click="
                                                    editReply(
                                                        comment.id,
                                                        reply.id
                                                    )
                                                "
                                                class="mt-[6px]"
                                                >답글 수정 완료
                                            </el-button>
                                        </div>
                                    </teleport>
                                </ClientOnly>
                            </div>
                            <div :id="'replyEditPosition'"></div>
                            <div
                                v-if="
                                    replyInputArea &&
                                    comment.id === replyComment
                                "
                                class="h-auto border-[1px] border-[#E5EAF3] rounded shadow-sm p-[12px] mb-[12px]"
                            >
                                <el-input
                                    v-model="reply"
                                    style="width: 100%"
                                    :rows="2"
                                    type="textarea"
                                    placeholder="답글을 입력하세요"
                                />
                                <el-button
                                    @click="writeReply(comment.id)"
                                    class="mt-[6px]"
                                    >답글 작성 완료
                                </el-button>
                            </div>
                        </el-list-item>
                    </el-list>
                    <div
                        v-if="$indexStore.auth.isAuthenticated"
                        class="h-auto border-[1px] border-[#E5EAF3] rounded shadow-sm p-[12px] mb-[12px]"
                    >
                        <el-input
                            v-model="comment"
                            style="width: 100%"
                            :rows="5"
                            type="textarea"
                            placeholder="Please input your comment"
                        />
                        <el-button @click="writeComment"
                            >댓글 작성 완료
                        </el-button>
                    </div>
                </template>
            </el-card>
            <el-button
                v-if="$indexStore.auth.user.id === postInfo.registeredBy"
                type="primary"
                @click="navigateTo(`/post/edit/${route.params.id}`)"
            >
                글수정
            </el-button>
            <el-button
                v-if="$indexStore.auth.user.id === postInfo.registeredBy"
                type="danger"
                @click="deletePost"
            >
                글삭제
            </el-button>
        </el-container>
        <el-aside style="width: auto">
            <Sidebar />
        </el-aside>
    </el-container>
</template>

<script setup lang="ts">
import type { PostInfo, CommentInfo, LikeInfo } from "~/types/interface"
import type { AxiosResponse } from "axios"
const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp()

const route = useRoute()
const router = useRouter()

const postId: string = route.params.id as string
const postInfo: Ref<PostInfo> = ref({} as PostInfo)
const likeInfo: Ref<LikeInfo> = ref({} as LikeInfo)

const commentList: Ref<CommentInfo[]> = ref([])
const comment: Ref<string> = ref("")
const editedComment: Ref<string> = ref("")
const editedCommentNum: Ref<number> = ref(0)
const editCommentInputArea: Ref<boolean> = ref(false)
const reply: Ref<string> = ref("")
const replyInputArea: Ref<boolean> = ref(false)
const replyComment: Ref<number> = ref(0)
const editedReplyNum: Ref<number> = ref(0)
const editedReply: Ref<string> = ref("")
const editedReplyInputArea: Ref<boolean> = ref(false)

onMounted(() => {
    getPostInfo()
    getCommentInfo()
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

const onEditReplyArea = (replyId: number, content: string) => {
    editedReplyInputArea.value = !editedReplyInputArea.value
    editedReplyNum.value = replyId
    editedReply.value = content
}

const getPostInfo = async () => {
    try {
        const postResponse: AxiosResponse = await $axios.get(
            `/posts/postInfo/${postId}`
        )

        if (!$errorHandler(postResponse)) return

        if (postResponse.data.postInfo.active === 0) {
            router.back()
        }

        postInfo.value = postResponse.data.postInfo
        likeInfo.value = postResponse.data.likeInfo
    } catch (error: any) {
        $catchError(error)
    }
}
const getCommentInfo = async () => {
    try {
        const commentResponse: AxiosResponse = await $axios.get(
            `/comments/commentList/${postId}`
        )

        if (!$errorHandler(commentResponse)) return

        commentList.value = commentResponse.data.commentList
        console.log(commentList.value)
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
        getCommentInfo()
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
        getCommentInfo()
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
        getCommentInfo()
    } catch (error: any) {
        $catchError(error)
    }
}

const editReply = async (commentId: number, replyId: number) => {
    console.log(commentId, replyId, editedReply.value)
    try {
        const result: AxiosResponse = await $axios.post(
            "/comments/edit",
            {
                reply: editedReply.value,
                replyId: replyId,
            },
            {
                headers: {
                    requiresToken: true,
                },
            }
        )

        if (!$errorHandler(result)) return

        ElMessage(`${result.data.message}`)
        editedReply.value = ""
        editedReplyInputArea.value = false
        getCommentInfo()
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
        getPostInfo()
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
            getPostInfo()
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
            getPostInfo()
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
        getPostInfo()
    } catch (error: any) {
        $catchError(error)
    }
}
</script>
