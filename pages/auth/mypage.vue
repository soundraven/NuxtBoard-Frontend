<template>
  <div
    class="w-full min-h-screen | flex justify-center | border border-border-darkerBorder dark:border-darkBorder-darkerBorder | !px-[12px]"
  >
    <el-container
      class="max-w-[1000px] flex flex-row border border-border-darkerBorder dark:border-darkBorder-darkerBorder bg-background-basicWhite dark:bg-darkBackground-lighterFill | mr-[12px]"
    >
      <el-header
        class="w-full !h-[160px] | flex items-center border-b border-border-darkerBorder dark:border-darkBorder-darkerBorder p-[12px]"
      >
        <el-button
          type="primary"
          v-if="$indexStore.auth.user.userName === ''"
          @click="setUserNameVisible = true"
        >
          익명{{ $indexStore.auth.user.id }}, Please set your User name
        </el-button>
        <span v-else class="text-[22px]">
          사용자
          <span class="font-bold">{{ $indexStore.auth.user.userName }}</span>
          <p class="text-[16px]">기본 정보 입니다.</p></span
        >
      </el-header>
      <el-tabs class="h-full | pt-[12px] px-[12px]" :tab-position="tabPosition">
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
              v-loading="loading"
              :highlight-current-row="true"
              class="mx-auto"
              :header-cell-style="getHeaderStyle"
              row-class-name="custom-row"
            >
              <el-table-column
                prop="id"
                label="ID"
                min-width="60"
                align="center"
              />
              <el-table-column
                prop="boardName"
                label="게시판"
                min-width="70"
                align="center"
              />
              <el-table-column
                prop="title"
                label="제목"
                align="left"
                header-align="center"
                show-overflow-tooltip
              >
                <template #default="scope">
                  <a
                    @click="navigateTo(`/post/${scope.row.id}`)"
                    class="text-blue-500 cursor-pointer truncate"
                  >
                    {{ scope.row.title }}
                  </a>
                </template>
              </el-table-column>
              <el-table-column
                prop="formattedDate"
                label="작성일자"
                min-width="160"
                align="center"
              />
            </el-table>
            <div v-if="noMore">
              <el-empty :image-size="100" description="No more post!" />
            </div>
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
                v-loading="loading"
                :highlight-current-row="true"
                class="mx-auto"
                :header-cell-style="getHeaderStyle"
                row-class-name="custom-row"
              >
                <el-table-column
                  prop="id"
                  label="ID"
                  min-width="60"
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
                      class="text-blue-500 cursor-pointer truncate"
                    >
                      {{ scope.row.content }}
                    </a>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="formattedDate"
                  label="작성일자"
                  min-width="160"
                  align="center"
                />
              </el-table>
              <div v-if="noMore">
                <el-empty :image-size="100" description="No more post!" />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Resign">
          <div class="flex justify-center items-center">
            <el-button
              type="danger"
              @click="showDeactivateModal"
              class="!w-[300px] !h-[200px] | mt-[200px]"
            >
              <el-icon :size="100">
                <WarningFilled />
              </el-icon>
            </el-button>
          </div>
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
  <Modal
    v-model="isModalVisible"
    :title="`${modalTitle}`"
    @confirm="modalConfirmAction"
  >
    <p>{{ modalContent }}</p>
  </Modal>
</template>
<script setup lang="ts">
import type { CommentInfo, PostInfo, UserInfo } from "@/types/interface";
import type { FormInstance } from "element-plus";
import rules from "~/utils/formRules";
import { useModal } from "~/composables/useModals";

definePageMeta({
  middleware: "auth",
});

const router = useRouter();

const colorMode = useColorMode();

const { $indexStore, $catchError, $apiGet, $apiPost } = useNuxtApp();
const {
  isModalVisible,
  modalTitle,
  modalContent,
  modalConfirmAction,
  openModal,
} = useModal();

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

const tabPosition: Ref<"left" | "top" | "bottom" | "right"> = ref("left");

const handleResize = () => {
  if (window.innerWidth < 860) {
    tabPosition.value = "top";
  } else {
    tabPosition.value = "left";
  }
};

onMounted(async () => {
  getPostList();
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
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

const showDeactivateModal = () => {
  openModal("Account Delete", "Deleting your account is irreversible.", () => {
    deactivate();
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
