<template>
  <div v-if="form" class="w-full | flex justify-center">
    <el-container
      class="max-w-[1000px] h-screen | flex justify-center | border border-border-darkerBorder dark:border-darkBorder-darkerBorder bg-background-basicWhite dark:bg-darkBackground-lighterFill | mr-[12px]"
    >
      <el-form :model="form" class="w-full mx-[12px]">
        <div
          class="w-full h-[100px] | flex items-center | text-[22px] font-bold | border-b border-border-darkerBorder dark:border-darkBorder-darkerBorder px-[12px]"
        >
          {{ $indexStore.commoncode.boards[form.boardId].boardName }} 게시판
        </div>
        <el-form-item class="mt-[12px]">
          <el-select
            v-model="form.boardId"
            placeholder="게시판을 선택해 주세요"
          >
            <el-option
              v-for="(option, index) in options"
              :key="option.boardId"
              :label="option.boardName"
              :value="option.boardId"
              v-if="options.length > 0"
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
            placeholder="제목을 입력해 주세요"
          />
        </el-form-item>
        <el-form-item>
          <rich-editor
            v-model="test"
            @input="(e: string) => (form.content = e)"
          />
        </el-form-item>
        <div class="flex justify-end">
          <el-button @click="onSubmit" class="w-[80px] ml-auto">작성</el-button>
        </div>
      </el-form>
    </el-container>
    <el-aside style="width: auto">
      <Sidebar />
    </el-aside>
  </div>
</template>
<script setup lang="ts">
import type { PostInfo } from "@/types/interface";
import api from "@/utils/generalServerResponse";

const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp();
const route = useRoute();

const form = reactive({ title: "", content: "", boardId: 0, id: 0 });
const postId: string = route.params.id as string;

const test = "test";

definePageMeta({
  middleware: "auth",
});

onMounted(() => {
  getPostInfo(postId);
});

const options = computed(() => $indexStore.commoncode.boards);

const getPostInfo = async (postId: string) => {
  try {
    // const result = await $axios.get(`/posts/postinfo/${postId}`);
    const result = await api<PostInfo>("get", `/posts/postinfo/${postId}`);

    if (!$errorHandler(result)) return;

    const postInfo: PostInfo = result.data.postInfo;

    form.title = postInfo.title;
    form.content = postInfo.content;
    form.boardId = postInfo.boardId;
    form.id = Number(postId);
    console.log(form.content);
  } catch (error: any) {
    $catchError(error);
  }
};

const onSubmit = async () => {
  try {
    // const result = await $axios.post(
    //   "/posts/edit",
    //   {
    //     post: form,
    //     user: $indexStore.auth.user,
    //   },
    //   {
    //     headers: {
    //       requiresToken: true,
    //     },
    //   }
    // );
    const result = await api("post", "/posts/edit", {
      post: form,
      user: $indexStore.auth.user,
      headers: {
        requiresToken: true,
      },
    });

    if (!$errorHandler(result)) return;

    ElMessage(`${result.message}`);
    navigateTo(`/post/${postId}`);
  } catch (error: any) {
    $catchError(error);
  }
};
</script>
