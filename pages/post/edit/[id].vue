<template>
  <div v-if="form" class="w-full | flex justify-center">
    <el-container
      class="max-w-[1000px] h-screen | flex justify-center | border border-border-darkerBorder dark:border-darkBorder-darkerBorder bg-background-basicWhite dark:bg-darkBackground-lighterFill | mr-[12px]"
    >
      <el-form :model="form" class="w-full mx-[12px]">
        <div
          v-if="form.boardId && $indexStore.commoncode.boards"
          class="w-full h-[100px] | flex items-center | text-[22px] font-bold | border-b border-border-darkerBorder dark:border-darkBorder-darkerBorder px-[12px]"
        >
          {{ boardName }} 게시판
        </div>
        <el-form-item class="mt-[12px]">
          <el-select
            v-model="form.boardId"
            placeholder="게시판을 선택해 주세요"
            :key="form.boardId"
          >
            <el-option
              v-for="(option, index) in options"
              :key="option.boardId"
              :label="option.boardName"
              :value="option.boardId"
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
          <ckeditor
            v-if="editor"
            :editor="editor"
            v-model="form.content"
            class="!w-full !h-[600px]"
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

const { $indexStore, $apiGet, $apiPost } = useNuxtApp();
const route = useRoute();

const editor = ref<typeof ClassicEditor | null>(null);

const form = reactive({ title: "", content: "", boardId: 0, id: 0 });
const postId: string = route.params.id as string;

const boardName = computed(
  () =>
    $indexStore.commoncode.boards.find(
      (board) => board.boardId === form.boardId
    )?.boardName
);

definePageMeta({
  middleware: "auth",
});

onMounted(async () => {
  const { default: ClassicEditor } = await import(
    "@ckeditor/ckeditor5-build-classic"
  );
  editor.value = ClassicEditor;

  getPostInfo(postId);
  const boardIdNum = Number(route.query.boardId);
  form.boardId = boardIdNum;
});

const options = $indexStore.commoncode.boards;

const getPostInfo = async (postId: string) => {
  const result = await $apiGet<{ postInfo: PostInfo }>(
    `/posts/postinfo/${postId}`
  );

  const postInfo = result.data?.postInfo;

  if (postInfo) {
    form.title = postInfo.title;
    form.content = postInfo.content;
    form.boardId = postInfo.boardId;
    form.id = Number(postId);
  }
};

const onSubmit = async () => {
  const result = await $apiPost(
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

  ElMessage(`${result.message}`);
  navigateTo(`/post/${postId}`);
};
</script>

<style>
.ck.ck-editor {
  width: 100%;
}
.ck-editor__editable {
  height: 800px;
}
</style>
