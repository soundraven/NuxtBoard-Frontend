<template>
  <div class="w-full | flex justify-center">
    <el-container
      class="max-w-[1000px] h-screen | flex justify-center | border border-border-darkerBorder dark:border-darkBorder-darkerBorder bg-background-basicWhite dark:bg-darkBackground-lighterFill | mr-[12px]"
    >
      <el-form :model="form" class="w-full mx-[12px]">
        <div
          v-if="form.boardId && $indexStore.commoncode.boards[form.boardId]"
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
            :value="form.content"
            @input="(e: any) => (form.content = e)"
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
const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp();

const route = useRoute();

definePageMeta({
  middleware: "auth",
});

const form = reactive({ title: "", content: "", boardId: 0 });

const options = computed(() => $indexStore.commoncode.boards);

onMounted(async () => {
  await $indexStore.commoncode.getBoards();
  const boardIdNum = Number(route.query.boardId);
  form.boardId = boardIdNum;
});

const onSubmit = async () => {
  if (!form.boardId) {
    ElMessage.error("Please select a board.");
    return;
  }

  try {
    const result = await $axios.post(
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

    if (!$errorHandler(result)) return;

    ElMessage(`${result.data.message}`);
    navigateTo(`/post/${result.data.postId}`);
  } catch (error: any) {
    $catchError(error);
  }
};
</script>
