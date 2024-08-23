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
              :class="likeAnimationClass"
            >
              <div>추천</div>
              <div>{{ likeInfo.totalLikes }}</div>
            </el-button>
            <el-button
              icon="Remove"
              type="danger"
              @click="handleLike(false)"
              class="w-[90px] min-h-[60px]"
              :class="dislikeAnimationClass"
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
                    class="z-10 !w-[10px] !h-[20px]"
                  />
                  <el-button
                    icon="delete"
                    type="danger"
                    @click.stop="deleteComment(comment.id)"
                    class="z-10 !w-[10px] !h-[20px]"
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
                placeholder="댓글을 입력해주세요"
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
                      class="z-10 !w-[10px] !h-[20px]"
                    />
                    <el-button
                      icon="delete"
                      type="danger"
                      @click.stop="deleteComment(comment.id)"
                      class="z-10 !w-[10px] !h-[20px]"
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
            placeholder="댓글을 입력해주세요"
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
import type { PostInfo } from "@/types/interface";
import type { AxiosResponse } from "axios";

const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp();
const route = useRoute();

const form = reactive({ title: "", content: "", boardId: 0, id: 0 });
const postId: string = route.params.id as string;

definePageMeta({
  middleware: "auth",
});

onMounted(() => {
  getPostinfo(postId);
});

const options = computed(() =>
  $indexStore.commoncode.boards.map((board) => ({
    value: board.id,
    label: board.name,
  }))
);

const getPostinfo = async (postId: string) => {
  try {
    const result: AxiosResponse = await $axios.get(`/posts/postinfo/${postId}`);

    if (!$errorHandler(result)) return;

    const postinfo: PostInfo = result.data.postinfo;

    form.title = postinfo.title;
    form.content = postinfo.content;
    form.boardId = postinfo.boardId;
    form.id = Number(postId);
  } catch (error: any) {
    $catchError(error);
  }
};

const onSubmit = async () => {
  try {
    const result = await $axios.post(
      "/posts/edit",
      {
        post: form,
        user: $indexStore.auth.user,
      },
      {
        headers: {
          requiresToken: true,
        },
      }
    );

    if (!$errorHandler(result)) return;

    ElMessage(`${result.data.message}`);
    navigateTo(`/post/${postId}`);
  } catch (error: any) {
    $catchError(error);
  }
};
</script>
