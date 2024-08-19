<template>
  <div class="w-full | flex justify-center">
    <el-container
      class="min-w-[1000px] max-w-[1000px] flex-wrap border border-[rgb(229,234,243)] rounded shadow-sm p-[12px]"
    >
      <el-form :model="form" class="w-full mx-auto">
        <el-form-item>
          <el-select
            v-model="form.boardId"
            placeholder="please select your board"
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
            placeholder="Please input your title"
          />
        </el-form-item>
        <el-form-item>
          <rich-editor
            :value="form.content"
            @input="(e: any) => (form.content = e)"
          />
        </el-form-item>
      </el-form>
      <el-button @click="onSubmit" class="w-[120px] ml-auto"
        >글 작성완료
      </el-button>
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
