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
      </el-header>
      <el-tabs class="h-full | pt-[12px] px-[12px]" tab-position="left">
        <el-tab-pane label="Home" class="px-[12px]">
          <div
            class="text-[22px] font-bold | underline underline-offset-[6px] decoration-2 decoration-blue-500 | mb-[12px]"
          >
            나의 최신 게시글
          </div>
          <div
            v-for="post in postList.slice(0, 10)"
            key="post.id"
            class="flex justify-between | text-[15px] | mt-[2px]"
          >
            <span class="w-full truncate ...">
              {{ post.title }}
            </span>
            <span class="whitespace-nowrap hidden md:inline">
              {{ post.formattedDate }}
            </span>
          </div>

          <div
            class="text-[22px] font-bold | underline underline-offset-[6px] decoration-2 decoration-blue-500 | mt-[12px] mb-[12px]"
          >
            나의 최신 댓글
          </div>
          <div
            v-for="comment in commentList.slice(0, 10)"
            key="comment.id"
            class="flex justify-between | text-[15px] | mt-[2px]"
          >
            <span class="w-full truncate ...">
              {{ comment.content }}
            </span>
            <span class="whitespace-nowrap hidden md:inline">
              {{ comment.formattedDate }}
            </span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="My post">
          <div
            class="w-full h-[800px] | border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm | overflow-auto"
            v-infinite-scroll="getPostList"
            infinite-scroll-distance="400"
            :infinite-scroll-disabled="disabled"
            infinite-scroll-immediate="false"
            infinite-scroll-delay="500"
          >
            <el-table
              :data="postList"
              :highlight-current-row="true"
              class="mx-auto"
              :header-cell-style="getHeaderStyle"
              row-class-name="custom-row"
            >
              <el-table-column
                prop="id"
                label="ID"
                width="100"
                align="center"
              />
              <el-table-column
                prop="boardName"
                label="게시판"
                width="80"
                align="center"
              />
              <el-table-column
                prop="title"
                label="제목"
                align="left"
                header-align="center"
              >
                <template #default="scope">
                  <a
                    @click="navigateTo(`/post/${scope.row.id}`)"
                    class="text-blue-500 cursor-pointer truncate"
                    >{{ scope.row.title }}
                  </a>
                </template>
              </el-table-column>
              <el-table-column
                prop="formattedDate"
                label="작성일자"
                width="180"
                align="center"
              />
            </el-table>
            <p v-if="loading">Loading...</p>
            <p v-if="noMore">No more Post</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="My comment">
          <div>
            <div
              class="w-full h-[800px] overflow-auto border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm"
              v-infinite-scroll="getPostList"
              infinite-scroll-distance="400"
              :infinite-scroll-disabled="disabled"
              infinite-scroll-immediate="false"
              infinite-scroll-delay="1000"
            >
              <el-table
                :data="commentList"
                :highlight-current-row="true"
                class="mx-auto"
                :header-cell-style="getHeaderStyle"
                row-class-name="custom-row"
              >
                <el-table-column
                  prop="id"
                  label="ID"
                  width="100"
                  align="center"
                />
                <el-table-column
                  prop="content"
                  label="내용"
                  align="left"
                  header-align="center"
                >
                  <template #default="scope">
                    <a
                      @click="navigateTo(`/post/${scope.row.post_id}`)"
                      class="text-blue-500 cursor-pointer"
                      >{{ scope.row.content }}
                    </a>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="formattedDate"
                  label="작성일자"
                  width="180"
                  align="center"
                />
              </el-table>
              <p v-if="loading">Loading...</p>
              <p v-if="noMore">No more Post</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Resign">
          <div class="flex justify-center items-center">
            <el-button
              type="warning"
              @click="dialogVisible = true"
              class="!w-[300px] !h-[200px] | mt-[200px]"
            >
              <el-icon :size="100">
                <WarningFilled />
              </el-icon>
            </el-button>
          </div>
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
  <el-dialog
    v-model="setUserNameVisible"
    title="Set your User name"
    width="500"
    :before-close="handleClose"
  >
    <el-form
      :model="userNameForm"
      :rules="rules"
      ref="userNameFormRef"
      label-width="120px"
    >
      <el-form-item label="User Name" prop="userName">
        <el-input
          v-model="userNameForm.userName"
          maxlength="12"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="setUserNameVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { CommentInfo, PostInfo, UserInfo } from "@/types/interface";
import type { FormInstance } from "element-plus";
import rules from "~/utils/formRules";

definePageMeta({
  middleware: "auth",
});

const router = useRouter();

const colorMode = useColorMode();

const { $indexStore, $catchError, $apiGet, $apiPost } = useNuxtApp();

const dialogVisible: Ref<boolean> = ref(false);
const setUserNameVisible: Ref<boolean> = ref(false);

const userNameForm = reactive({
  userName: "",
});
const userNameFormRef = ref<FormInstance>();

const currentPage: Ref<number> = ref(1);
const pageSize: Ref<number> = ref(30);
const totalCount: Ref<number> = ref(0);

const postList: Ref = ref([]);
const commentList: Ref = ref([]);

const loading = ref(false);
const noMore = computed(() => postList.value.length >= totalCount.value);
const disabled = computed(() => loading.value || noMore.value);

onMounted(async () => {
  getPostList();
});

const getPostList = async () => {
  loading.value = true;

  const registeredByJson = sessionStorage.getItem("user");
  let parsedRegisteredBy: UserInfo;

  if (!registeredByJson) {
    ElMessage.error("User info not found");
    return;
  } else {
    parsedRegisteredBy = JSON.parse(registeredByJson);
  }

  const [postResult, commentResult] = await Promise.all([
    $apiGet<{ postList: PostInfo[]; totalCount: number }>(
      "/posts/list",
      {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        registeredBy: parsedRegisteredBy.id,
      },
      {
        headers: {
          requiresToken: true,
        },
      }
    ),
    $apiGet<{ commentList: CommentInfo[] }>(
      `/comments/myCommentList/${parsedRegisteredBy.id}`,
      {
        registeredBy: parsedRegisteredBy.id,
      },
      {
        headers: {
          requiresToken: true,
        },
      }
    ),
  ]);

  if (postResult.data) {
    postList.value = [...postList.value, ...postResult.data.postList];
    totalCount.value = postResult.data?.totalCount || 0;
    currentPage.value += 1;
  }

  if (commentResult.data) {
    commentList.value = [...commentResult.data.commentList];
  }

  nextTick(() => {
    loading.value = false;
  });
};

const submitForm = () => {
  if (userNameFormRef.value) {
    userNameFormRef.value.validate((valid) => {
      if (valid) {
        setUserName();
      } else {
        ElMessage.error("Please correct the errors in the form");
      }
    });
  }
};

const setUserName = async () => {
  try {
    const userJson = sessionStorage.getItem("user");

    if (!userJson) {
      alert("Userinfo is missing");
      $indexStore.auth.logout();
      return;
    }

    const setUserNameResult = await $apiPost(
      "/users/setUserName",
      {
        user: $indexStore.auth.user,
        userName: userNameForm.userName,
      },
      {
        headers: {
          requiresToken: true,
        },
      }
    );

    ElMessage({ message: setUserNameResult.message, type: "success" });
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
    .catch(() => {});
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

    const deactivateResult = await $apiPost(
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

    ElMessage({ message: deactivateResult.message, type: "success" });
    $indexStore.auth.logout();
    dialogVisible.value = false;
    router.push("/");
  } catch (error: any) {
    $catchError(error);
  }
};

const getHeaderStyle = () => {
  return colorMode.value === "dark"
    ? { backgroundColor: "#39393a" }
    : { backgroundColor: "#ffffff" };
};
</script>

<style>
.custom-header {
  background-color: #ffffff;
  color: #000000;
}

.custom-row {
  background-color: #ffffff;
}

.dark .custom-header {
  background-color: #424243;
  color: #ffffff;
}
.dark .custom-row {
  background-color: #424243;
}
</style>
