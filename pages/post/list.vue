<template>
  <el-container class="h-screen | flex flex-col justify-center">
    <div
      class="w-[1000px] | border-x border-border-darkerBorder dark:border-darkBorder-darkerBorder dark:bg-darkBackground-lighterFill | mx-[12px] px-[12px] pt-[12px]"
    >
      <el-tabs
        v-model="currentBoardId"
        @tab-click="changeTab"
        :stretch="true"
        class="h-[40px] | border border-border-darkerBorder dark:border-darkBorder-darkerBorder shadow-sm rounded-tl rounded-tr | bg-background-basicWhite dark:bg-darkBackground-darkFill"
      >
        <el-tab-pane
          v-for="tab in $indexStore.commoncode.boards"
          :key="tab.boardId"
          :label="tab.boardName"
          :name="tab.boardId"
        />
      </el-tabs>
      <div
        class="w-full h-[1000px] | border border-border-darkerBorder dark:border-darkBorder-darkerBorder shadow-sm rounded-bl rounded-br | overflow-auto"
        v-infinite-scroll="getPostList"
        infinite-scroll-distance="500"
        :infinite-scroll-disabled="disabled"
        infinite-scroll-immediate="false"
        infinite-scroll-delay="1000"
      >
        <el-table
          :data="list"
          :highlight-current-row="true"
          class="w-full"
          :header-cell-style="getHeaderStyle"
          row-class-name="custom-row"
        >
          <el-table-column prop="id" label="ID" width="100" align="center" />
          <el-table-column
            prop="boardName"
            label="게시판"
            width="80"
            align="center"
          />
          <el-table-column
            prop="title"
            label="제목"
            width="440"
            align="left"
            header-align="center"
          >
            <template #default="scope">
              <a
                @click="navigateTo(`${scope.row.id}`)"
                class="w-full text-blue-500 cursor-pointer truncate"
              >
                {{ scope.row.title }}
              </a>
            </template>
          </el-table-column>
          <el-table-column
            prop="registeredUserName"
            label="작성자"
            width="150"
            align="center"
          />
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
      <div class="flex justify-end | mt-[12px]">
        <el-button @click="goToWrite">글작성</el-button>
      </div>
    </div>
    <el-aside style="width: auto">
      <Sidebar />
    </el-aside>
  </el-container>
</template>

<script setup lang="ts">
import type { PostInfo } from "~/types/interface";
import type { TabsPaneContext } from "element-plus";
const { $indexStore, $apiGet } = useNuxtApp();

const route = useRoute();
const router = useRouter();

const colorMode = useColorMode();

const currentPage = ref(1);
const pageSize = ref(30);
const totalCount = ref(0);
const registeredBy = ref<string>("");
const currentBoardId = ref<number>(0);

const loading = ref(false);
const noMore = computed(() => list.value.length >= totalCount.value);
const disabled = computed(() => loading.value || noMore.value);

const list: Ref<PostInfo[]> = ref([]);

onMounted(async () => {
  const boardId = Number(route.query.boardId);
  if (boardId) {
    currentBoardId.value = boardId;
  }

  await $indexStore.commoncode.getBoards();
  getPostList();
});

const getPostList = async () => {
  loading.value = true;

  const result = await $apiGet<{ postList: PostInfo[]; totalCount: number }>(
    "/posts/list",
    {
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      registeredBy: registeredBy.value,
      boardId: currentBoardId.value,
    }
  );

  if (result.data) {
    list.value = [...list.value, ...result.data.postList];
    totalCount.value = result.data.totalCount;
    currentPage.value += 1;
  }

  nextTick(() => {
    loading.value = false;
  });
};

const changeTab = (pane: TabsPaneContext) => {
  const newBoardId = pane.paneName as number;
  if (currentBoardId.value !== newBoardId) {
    currentBoardId.value = newBoardId;
    currentPage.value = 1;
    list.value = [];
    router.push({ query: { ...route.query, boardId: newBoardId } });
    getPostList();
  }
};

const goToWrite = () => {
  navigateTo({
    path: "/post/write",
    query: { boardId: currentBoardId.value },
  });
};

const getHeaderStyle = () => {
  return colorMode.value === "dark"
    ? { backgroundColor: "#424243" }
    : { backgroundColor: "#ffffff" };
};
</script>

<style>
.custom-row {
  background-color: #ffffff;
}

.dark .custom-row {
  background-color: #424243;
}
</style>
