<template>
  <div class="w-full | flex justify-center">
    <el-container
      class="max-w-[1000px] h-full | flex justify-center | border border-border-darkerBorder dark:border-darkBorder-darkerBorder bg-background-basicWhite dark:bg-darkBackground-lighterFill | mr-[12px]"
    >
      <el-form :model="form" class="w-full mx-[12px]">
        <div
          v-if="form.boardId && $indexStore.commoncode.boards"
          class="w-full h-[80px] | flex items-center | text-[22px] font-bold | border-b border-border-darkerBorder dark:border-darkBorder-darkerBorder px-[12px]"
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
            class="resize-none"
            placeholder="제목을 입력해 주세요"
          />
        </el-form-item>
        <el-form-item class="bg-red-50 w-full">
          <ckeditor v-if="editor" :editor="editor" v-model="form.content" />
        </el-form-item>
        <el-form-item>
          <el-upload
            class="w-full"
            drag
            :action="uploadActionUrl"
            multiple
            :on-success="handleFileUploadSuccess"
            :file-list="fileList"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              파일을 이곳에 드래그하거나 클릭하여 업로드
            </div>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <div class="flex justify-end | mb-[12px]">
          <el-button @click="onSubmit" class="w-[80px] ml-auto mb-[12px]">
            작성
          </el-button>
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
import type { UploadFile } from "element-plus";
import type {
  FileUrls,
  FormType,
  GeneralServerResponse,
} from "~/types/interface";

const config = useRuntimeConfig();
const baseURL = config.public.apiBaseUrl;
const uploadActionUrl = computed(() => `${baseURL}/posts/upload`);

const route = useRoute();

const editor = ref<typeof ClassicEditor | null>(null);

definePageMeta({
  middleware: "auth",
});

const form = reactive<FormType>({
  title: "",
  content: "",
  boardId: 0,
  files: [],
});

const fileList: Ref<UploadFile[]> = ref([]);

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
    ElMessage.error("게시판을 선택해 주세요.");
    return;
  }
  if (!form.title.trim()) {
    ElMessage.error("제목을 입력해 주세요.");
    return;
  }
  if (!form.content.trim()) {
    ElMessage.error("내용을 입력해 주세요.");
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

  ElMessage({ message: result.message, type: "success" });
  navigateTo(`/post/${result.data?.postId}`);
};

const handleFileUploadSuccess = (
  response: GeneralServerResponse<{ files: FileUrls[] }>
) => {
  ElMessage.success("File uploaded successfully!");

  const uploadedFiles = response.data?.files.map((file) => ({
    name: file.originalName,
    url: file.url,
    status: "success" as const,
    uid: Date.now() + Math.floor(Math.random() * 1000),
  }));

  if (uploadedFiles) {
    form.files = [...form.files, ...uploadedFiles.map((file) => file.url)];
    fileList.value = [...fileList.value, ...uploadedFiles];
  }
};
</script>

<style>
.ck.ck-editor {
  width: 100%;
}
.ck-editor__editable {
  height: 650px;
}

.dark .ck-editor__editable {
  color: #000000;
}
</style>
