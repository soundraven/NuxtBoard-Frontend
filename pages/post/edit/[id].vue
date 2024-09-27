<template>
  <div v-if="form" class="w-full | flex justify-center">
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
            class="resize-none"
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
        <div class="flex justify-end">
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
import type {
  FileUrls,
  GeneralServerResponse,
  PostInfo,
} from "@/types/interface";
import type ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { UploadFile } from "element-plus";
import type { FormType } from "~/types/interface";

const { $indexStore, $apiGet, $apiPost } = useNuxtApp();

const config = useRuntimeConfig();
const baseURL = config.public.apiBaseUrl;
const uploadActionUrl = computed(() => `${baseURL}/posts/upload`);

const route = useRoute();

const editor = ref<typeof ClassicEditor | null>(null);

const form = reactive<FormType>({
  title: "",
  content: "",
  boardId: 0,
  id: 0,
  files: [],
});

const postId: string = route.params.id as string;

const fileList: Ref<UploadFile[]> = ref([]);

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
    form.files = postInfo.files;
  }

  fileList.value = postInfo?.files
    ? postInfo.files.map((fileUrl, index) => ({
        name: fileUrl.split("/").pop() || `File-${index + 1}`,
        url: fileUrl,
        status: "success" as const,
        uid: Date.now() + index,
      }))
    : [];
};

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

  ElMessage({ message: result.message, type: "success" });
  navigateTo(`/post/${postId}`);
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
