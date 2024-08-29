<template>
  <div class="w-full | flex justify-center">
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
        <el-form-item class="bg-red-50 w-full">
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
const { $indexStore, $apiPost } = useNuxtApp();
import type ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const route = useRoute();

const editor = ref<typeof ClassicEditor | null>(null);

definePageMeta({
  middleware: "auth",
});

const form = reactive({ title: "", content: "", boardId: 0 });

const boardName = computed(
  () =>
    $indexStore.commoncode.boards.find(
      (board) => board.boardId === form.boardId
    )?.boardName
);

const options = computed(() => $indexStore.commoncode.boards);

onMounted(async () => {
  const { default: ClassicEditor } = await import(
    "@ckeditor/ckeditor5-build-classic"
  );
  editor.value = ClassicEditor;

  await $indexStore.commoncode.getBoards();
  const boardIdNum = Number(route.query.boardId);
  form.boardId = boardIdNum;
});

const onSubmit = async () => {
  if (!form.boardId) {
    ElMessage.error("Please select a board.");
    return;
  }

  const result = await $apiPost<{ postId: number }>(
    "/posts/write",
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
  navigateTo(`/post/${result.data?.postId}`);
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
