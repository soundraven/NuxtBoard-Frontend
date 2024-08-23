<template>
  <el-container v-if="postInfo" class="w-screen flex flex-col justify-center">
    <el-container
      class="max-w-[1000px] h-full | flex justify-center | border border-border-darkerBorder dark:border-darkBorder-darkerBorder bg-background-basicWhite dark:bg-darkBackground-lighterFill | mr-[12px]"
    >
      <div class="w-[1000px] min-h-[800px]">
        <div
          class="h-[100px] | flex items-center | text-[22px] font-bold | border-b border-border-darkerBorder dark:border-darkBorder-darkerBorder px-[12px]"
        >
          {{ postInfo.boardName }} 게시판
        </div>
        <div class="px-[12px]">
          <div
            class="h-[40px] | flex justify-between items-center | text-[18px] | border-y border-border-darkerBorder dark:border-darkBorder-darkerBorder bg-background-darkerFill dark:bg-darkBackground-darkerFill | mt-[12px] px-[12px]"
          >
            <span class="font-bold">{{ postInfo.title }}</span>
            <div>
              <el-button
                v-if="$indexStore.auth.user.id === postInfo.registeredBy"
                icon="edit"
                type="primary"
                @click="navigateTo(`/post/edit/${route.params.id}`)"
                class="!w-[30px] !h-[30px]"
              />
              <el-button
                v-if="$indexStore.auth.user.id === postInfo.registeredBy"
                icon="delete"
                type="danger"
                @click="deletePost"
                class="!w-[30px] !h-[30px]"
              />
            </div>
          </div>
          <div
            class="h-[30px] | flex justify-between items-center | border-b border-border-darkerBorder dark:border-darkBorder-darkerBorder | p-[12px]"
          >
            <span class="text-[15px]">{{ postInfo.registeredByUserName }}</span>
            <div class="text-[13px]">
              <span class="font-bold">추천: </span>
              <span
                class="bg-background-darkerFill dark:bg-darkBackground-darkerFill ml-[6px]"
              >
                {{ likeInfo.totalLikes }}
              </span>
              <span class="font-bold ml-[6px]">비추천: </span>
              <span
                class="bg-background-darkerFill dark:bg-darkBackground-darkerFill ml-[6px]"
              >
                {{ likeInfo.totalDislikes }}
              </span>
              <span class="font-bold ml-[6px]">댓글: </span>
              <span
                class="bg-background-darkerFill dark:bg-darkBackground-darkerFill ml-[6px]"
              >
                {{ commentList.length }}
              </span>
              <span class="font-bold ml-[6px]">작성일: </span>
              <span
                class="bg-background-darkerFill dark:bg-darkBackground-darkerFill ml-[6px]"
              >
                {{ postInfo.formattedDate }}
              </span>
            </div>
          </div>
          <client-only>
            <div class="min-h-[600px] p-[12px]" v-html="sanitizedContent"></div>
          </client-only>
          <div class="w-full h-full flex justify-center | mb-[12px]">
            <el-button
              icon="medal"
              type="primary"
              @click="handleLike(true)"
              class="w-[90px] min-h-[60px]"
            >
              <div>추천</div>
              <div>{{ likeInfo.totalLikes }}</div>
            </el-button>
            <el-button
              icon="Remove"
              type="danger"
              @click="handleLike(false)"
              class="w-[90px] min-h-[60px]"
            >
              <div>비추</div>
              <div>{{ likeInfo.totalDislikes }}</div>
            </el-button>
          </div>
          <div
            class="h-[40px] | flex justify-end items-center | border-t border-b border-border-darkerBorder dark:border-darkBorder-darkerBorder"
          >
            <el-button icon="bell" type="danger" @click="report">
              <div>{{ postInfo.report }}</div>
            </el-button>
          </div>
          <div
            class="h-[40px] | flex items-center | border-b border-border-darkerBorder dark:border-darkBorder-darkerBorder | p-[12px]"
          >
            댓글: [{{ commentList.length }}]
          </div>
        </div>
        <div v-for="(comment, index) in commentList" :key="comment.id" class="">
          <div class="w-[1000px] | px-[24px]">
            <div
              class="w-[950px] h-[60px] | flex flex-col justify-between items-center | border border-border-darkerBorder dark:border-darkBorder-darkerBorder | mt-[12px] mx-auto cursor-pointer"
              :class="{
                'bg-background-lightFill dark:bg-darkBackground-lightFill':
                  (editCommentInputArea && comment.id === editedCommentNum) ||
                  (replyInputArea && comment.id === replyComment),
              }"
              @click="onReplyArea(comment.id)"
            >
              <div
                class="w-full h-[25px] | flex justify-between items-center | border-b border-dashed border-border-darkerBorder dark:border-darkBorder-darkerBorder bg-background-darkerFill dark:bg-darkBackground-darkerFill | px-[12px]"
              >
                <span
                  v-if="comment.userName === ''"
                  class="text-[15px] | mr-[6px]"
                >
                  익명
                </span>
                <span v-else class="text-[15px] | mr-[6px]">
                  {{ comment.userName }}
                </span>
                <div
                  v-if="comment.registeredBy === $indexStore.auth.user.id"
                  class="flex space-x-2 items-center"
                >
                  <span class="text-[14px]">{{ comment.formattedDate }}</span>
                  <el-button
                    icon="edit"
                    type="primary"
                    @click.stop="onEditArea(comment.id, comment.content)"
                    class="z-10"
                  />
                  <el-button
                    icon="delete"
                    type="danger"
                    @click.stop="deleteComment(comment.id)"
                  />
                </div>
              </div>
              <div
                class="w-full h-[35px] | flex justify-start items-center | text-[15px] | p-[12px]"
              >
                <span>{{ comment.content }}</span>
              </div>
            </div>
            <div
              class="w-[950px] h-auto | flex flex-col | pt-[12px]"
              v-if="editCommentInputArea && comment.id === editedCommentNum"
            >
              <el-input
                v-model="editedComment"
                :rows="2"
                type="textarea"
                placeholder="Please input your comment"
              />
              <el-button class="ml-auto mt-[12px]" @click="editComment">
                댓글 수정
              </el-button>
            </div>
            <div
              v-for="(reply, index) in comment.replies"
              :key="reply.id"
              class="w-[900px] h-[60px] | flex flex-col justify-between items-center | border border-border-darkerBorder dark:border-darkBorder-darkerBorder | mt-[12px] ml-auto"
              :class="{
                'bg-background-lightFill dark:bg-darkBackground-lightFill':
                  editedReplyInputArea && reply.id === editedReplyNum,
              }"
            >
              <div
                class="w-full h-[25px] | flex justify-between items-center | border-b border-dashed border-border-darkerBorder dark:border-darkBorder-darkerBorder bg-background-darkerFill dark:bg-darkBackground-darkerFill | px-[12px]"
              >
                <div class="w-full | flex justify-between items-center |">
                  <span v-if="!reply.userName" class="text-[15px] | mr-[12px]"
                    >익명
                  </span>
                  <span v-else class="text-[15px] | mr-[12px]">
                    {{ reply.userName }}
                  </span>
                  <div
                    v-if="reply.registeredBy === $indexStore.auth.user.id"
                    class="flex space-x-2 items-center"
                  >
                    <span class="text-[14px]">{{ reply.formattedDate }}</span>
                    <el-button
                      icon="Edit"
                      type="primary"
                      style="my-auto"
                      @click.stop="onEditReplyArea(reply.id, reply.content)"
                    />
                    <el-button
                      icon="delete"
                      type="danger"
                      @click.stop="deleteComment(comment.id)"
                    />
                  </div>
                </div>
              </div>
              <div
                class="w-full h-[35px] | flex justify-start items-center | text-[15px] | p-[12px]"
              >
                <span>{{ reply.content }}</span>
              </div>
              <ClientOnly>
                <teleport to="#replyEditPosition">
                  <div
                    v-if="editedReplyInputArea && reply.id === editedReplyNum"
                    class="w-[900px] h-auto | flex flex-col | pt-[12px] ml-auto"
                  >
                    <el-input
                      v-model="editedReply"
                      :rows="2"
                      type="textarea"
                      placeholder="답글을 수정하세요"
                    />
                    <div class="flex justify-end mt-[12px]">
                      <el-button
                        @click="editReply(comment.id, reply.id)"
                        class="mt-[6px]"
                      >
                        답글 수정
                      </el-button>
                    </div>
                  </div>
                </teleport>
              </ClientOnly>
            </div>
            <div :id="'replyEditPosition'"></div>
            <div
              v-if="replyInputArea && comment.id === replyComment"
              class="w-[950px] h-auto | mt-[12px] ml-auto"
            >
              <el-input
                v-model="reply"
                style="width: 100%"
                :rows="2"
                type="textarea"
                placeholder="답글을 입력하세요"
              />
              <div class="flex justify-end | mt-[12px]">
                <el-button @click="writeReply(comment.id)">
                  답글 작성
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="$indexStore.auth.isAuthenticated"
          class="w-[950px] h-auto mt-[12px] ml-[24px]"
        >
          <el-input
            v-model="comment"
            :rows="2"
            type="textarea"
            placeholder="Please input your comment"
          />
          <div class="flex justify-end | mt-[12px]">
            <el-button @click="writeComment">댓글 작성</el-button>
          </div>
        </div>
      </div>
    </el-container>
    <el-aside style="width: auto">
      <Sidebar />
    </el-aside>
  </el-container>
</template>

<script setup lang="ts">
import type { PostInfo, CommentInfo, LikeInfo } from "~/types/interface";
import type { AxiosResponse } from "axios";
import DOMPurify from "dompurify";
import "element-plus/theme-chalk/dark/css-vars.css";

const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp();

const route = useRoute();
const router = useRouter();

const postId: string = route.params.id as string;
const postInfo: Ref<PostInfo> = ref({} as PostInfo);
const likeInfo: Ref<LikeInfo> = ref({} as LikeInfo);
const sanitizedContent = computed(() =>
  DOMPurify.sanitize(postInfo.value.content)
);

const commentList: Ref<CommentInfo[]> = ref([]);
const comment: Ref<string> = ref("");
const editedComment: Ref<string> = ref("");
const editedCommentNum: Ref<number> = ref(0);
const editCommentInputArea: Ref<boolean> = ref(false);
const reply: Ref<string> = ref("");
const replyInputArea: Ref<boolean> = ref(false);
const replyComment: Ref<number> = ref(0);
const editedReplyNum: Ref<number> = ref(0);
const editedReply: Ref<string> = ref("");
const editedReplyInputArea: Ref<boolean> = ref(false);

onMounted(() => {
  getPostInfo();
  getCommentInfo();
});

const onReplyArea = (commentId: number) => {
  replyInputArea.value = !replyInputArea.value;
  replyComment.value = commentId;
};

const onEditArea = (commentId: number, content: string) => {
  editCommentInputArea.value = !editCommentInputArea.value;
  editedCommentNum.value = commentId;
  editedComment.value = content;
};

const onEditReplyArea = (replyId: number, content: string) => {
  editedReplyInputArea.value = !editedReplyInputArea.value;
  editedReplyNum.value = replyId;
  editedReply.value = content;
};

const getPostInfo = async () => {
  try {
    const postResponse: AxiosResponse = await $axios.get(
      `/posts/postInfo/${postId}`
    );

    if (!$errorHandler(postResponse)) return;

    if (postResponse.data.postInfo.active === 0) {
      router.back();
    }

    postInfo.value = postResponse.data.postInfo;
    likeInfo.value = postResponse.data.likeInfo;

    const boardId = postInfo.value.boardId;
    if (boardId) {
      router.replace({
        path: route.path,
        query: { ...route.query, boardId: boardId.toString() },
      });
    }

    console.log(postInfo.value);
  } catch (error: any) {
    $catchError(error);
  }
};

const getCommentInfo = async () => {
  try {
    const commentResponse: AxiosResponse = await $axios.get(
      `/comments/commentList/${postId}`
    );

    if (!$errorHandler(commentResponse)) return;

    commentList.value = commentResponse.data.commentList;
  } catch (error: any) {
    $catchError(error);
  }
};

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
    );

    if (!$errorHandler(result)) return;

    ElMessage(`${result.data.message}`);
    comment.value = "";
    getCommentInfo();
  } catch (error: any) {
    $catchError(error);
  }
};

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
    );

    if (!$errorHandler(result)) return;

    ElMessage(`${result.data.message}`);
    editedComment.value = "";
    editedCommentNum.value = 0;
    editCommentInputArea.value = false;
    getCommentInfo();
  } catch (error: any) {
    $catchError(error);
  }
};

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
    );

    if (!$errorHandler(result)) return;

    ElMessage(`${result.data.message}`);
    reply.value = "";
    replyInputArea.value = false;
    getCommentInfo();
  } catch (error: any) {
    $catchError(error);
  }
};

const editReply = async (commentId: number, replyId: number) => {
  console.log(commentId, replyId, editedReply.value);
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
    );

    if (!$errorHandler(result)) return;

    ElMessage(`${result.data.message}`);
    editedReply.value = "";
    editedReplyInputArea.value = false;
    getCommentInfo();
  } catch (error: any) {
    $catchError(error);
  }
};

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
    );

    if (!$errorHandler(deletePostResult)) return;

    ElMessage("Post successfully deleted");
    navigateTo("/");
  } catch (error: any) {
    $catchError(error);
  }
};

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
    );

    if (!$errorHandler(deleteCommentResult)) return;

    ElMessage("Comment successfully deleted");
    getPostInfo();
  } catch (error: any) {
    $catchError(error);
  }
};

const handleLike = async (liked: boolean) => {
  if (liked) {
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
      );

      if (!$errorHandler(like)) return;
      ElMessage("Successfully liked");
      getPostInfo();
    } catch (error: any) {
      $catchError(error);
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
      );

      if (!$errorHandler(dislike)) return;
      ElMessage("Successfully liked");
      getPostInfo();
    } catch (error: any) {
      $catchError(error);
    }
  }
};

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
    );

    if (!$errorHandler(reportResult)) return;

    ElMessage(reportResult.data.message);
    getPostInfo();
  } catch (error: any) {
    $catchError(error);
  }
};
</script>
