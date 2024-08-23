<template>
  <div
    class="w-full h-screen | flex justify-center | border border-border-darkerBorder dark:border-darkBorder-darkerBorder | !px-[12px]"
  >
    <el-container
      class="max-w-[1000px] h-screen flex flex-row border border-border-darkerBorder dark:border-darkBorder-darkerBorder bg-background-basicWhite dark:bg-darkBackground-lighterFill | mr-[12px]"
    >
      <el-header
        class="w-full !h-[200px] | flex items-center border-b border-border-darkerBorder dark:border-darkBorder-darkerBorder p-[12px]"
      >
        <el-button
          type="primary"
          v-if="$indexStore.auth.user.userName === ''"
          @click="setUserNameVisible = true"
          >Please set your User name</el-button
        >
        <span v-else class="text-[22px]">
          사용자
          <span class="font-bold">{{ $indexStore.auth.user.userName }}</span>
          <p class="text-[16px]">기본 정보 입니다.</p></span
        >
        <el-dialog
          v-model="setUserNameVisible"
          title="Set your User name"
          width="500"
          :before-close="handleClose"
        >
          <el-input
            v-model="userName"
            style="width: 300px; margin-left: 99px"
            maxlength="12"
            show-word-limit
            :rows="1"
            type="textarea"
            placeholder="Please input your username"
          />
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="setUserNameVisible = false">Cancel</el-button>
              <el-button type="primary" @click="setUserName">
                Confirm
              </el-button>
            </div>
          </template>
        </el-dialog>
      </el-header>
      <el-tabs class="h-full | pt-[12px] px-[12px]" tab-position="left">
        <el-tab-pane label="Home" class="px-[12px]">
          <div
            class="text-[22px] font-bold | underline underline-offset-[4px] decoration-2 decoration-success | mb-[12px]"
          >
            나의 최신 게시글
          </div>
          <div
            v-for="post in postList.slice(0, 10)"
            key="post.id"
            class="flex justify-between | text-[15px] | mt-[2px]"
          >
            <span class="w-[550px] truncate ...">
              {{ post.title }}
            </span>
            <span>
              {{ post.formattedDate }}
            </span>
          </div>

          <div
            class="text-[22px] font-bold | underline underline-offset-[4px] decoration-2 decoration-success | mt-[12px] mb-[12px]"
          >
            나의 최신 댓글
          </div>
          <div
            v-for="comment in commentList.slice(0, 10)"
            key="comment.id"
            class="flex justify-between | text-[15px] | mt-[2px]"
          >
            <span class="w-[550px] truncate ...">
              {{ comment.content }}
            </span>
            <span>{{ comment.formattedDate }}</span>
          </div>
        </el-tab-pane>
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
                    @click="navigateTo(`/post/${scope.row.id}`)"
                    class="text-blue-500 cursor-pointer"
                    >{{ scope.row.title }}</a
                  >
                </template>
              </el-table-column>

              <el-table-column prop="registered_date" label="작성일자" />
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
                      @click="navigateTo(`/post/${scope.row.post_id}`)"
                      class="text-blue-500 cursor-pointer"
                      >{{ scope.row.content }}</a
                    >
                  </template>
                </el-table-column>
                <el-table-column prop="registered_date" label="작성일자" />
              </el-table>
            </div></div
        ></el-tab-pane>
        <el-tab-pane label="Resign">
          <el-button type="warning" @click="dialogVisible = true">
            회원탈퇴
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
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="danger" @click="deactivate">
                  Confirm
                </el-button>
              </div>
            </template>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </el-container>
    <el-aside style="width: auto">
      <Sidebar />
    </el-aside>
  </div>
</template>
<script setup lang="ts">
import type { UserInfo } from "@/types/interface";
import type { AxiosResponse } from "axios";

definePageMeta({
  middleware: "auth",
});

const router = useRouter();

const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp();

const dialogVisible: Ref<boolean> = ref(false);
const setUserNameVisible: Ref<boolean> = ref(false);

const userName: Ref<string> = ref("");

const currentPage: Ref<number> = ref(1);
const pageSize: Ref<number> = ref(20);
const totalCount: Ref<number> = ref(0);

const postList: Ref = ref([]);
const commentList: Ref = ref([]);

const setUserName = async () => {
  try {
    const userJson = sessionStorage.getItem("user");

    if (!userJson) {
      alert("Userinfo is missing");
      $indexStore.auth.logout();
      return;
    }

    const setUserNameResult: AxiosResponse = await $axios.post(
      "/users/setUserName",
      {
        user: $indexStore.auth.user,
        userName: userName.value,
      },
      {
        headers: {
          requiresToken: true,
        },
      }
    );

    if (!$errorHandler(setUserNameResult)) return;

    ElMessage("User name successfully set");
    setUserNameVisible.value = false;
    $indexStore.auth.setUserName();
  } catch (error: any) {
    $catchError(error);
  }
};

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

const deactivate = async () => {
  try {
    const userJson = sessionStorage.getItem("user");

    if (!userJson) {
      alert("Userinfo is missing");
      $indexStore.auth.logout();
      return;
    }

    const user: UserInfo = JSON.parse(userJson);

    const deactivateResult: AxiosResponse = await $axios.post(
      "/users/deactivate",
      {
        user: user,
      },
      {
        headers: {
          requiresToken: true,
        },
      }
    );

    if (!$errorHandler(deactivateResult)) return;

    ElMessage("Account successfully deactivated");
    $indexStore.auth.logout();
    dialogVisible.value = false;
    router.push("/");
  } catch (error: any) {
    $catchError(error);
  }
};

const getPostList = async () => {
  try {
    const [postResult, commentResult]: [AxiosResponse, AxiosResponse] =
      await Promise.all([
        $axios.get("/posts/list", {
          params: {
            currentPage: currentPage.value,
            pageSize: pageSize.value,
            registeredBy: $indexStore.auth.user.id,
          },
          headers: {
            requiresToken: true,
          },
        }),
        $axios.get(`/comments/myCommentList/${$indexStore.auth.user.id}`, {
          params: {
            registeredBy: $indexStore.auth.user.id,
          },
          headers: {
            requiresToken: true,
          },
        }),
      ]);

    if (!$errorHandler(postResult) || !$errorHandler(commentResult)) return;

    postList.value = postResult.data.postList;
    totalCount.value = postResult.data.totalCount;
    commentList.value = commentResult.data.commentList;
  } catch (error: any) {
    $catchError(error);
  }
};

watch(
  () => $indexStore.auth.user.id,
  (newId) => {
    if (newId) {
      getPostList();
    }
  }
);

onMounted(() => {
  getPostList();
});
</script>
