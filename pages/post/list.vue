<template>
  <el-container class="min-h-screen | flex flex-col justify-center">
    <div
      class="w-full max-w-[1000px] | border-x border-border-darkerBorder dark:border-darkBorder-darkerBorder dark:bg-darkBackground-lighterFill | mx-[12px] px-[12px] pt-[12px]"
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
        class="h-[800px] | border border-border-darkerBorder dark:border-darkBorder-darkerBorder shadow-sm rounded-bl rounded-br | overflow-auto"
        v-infinite-scroll="getPostList"
        infinite-scroll-distance="500"
        :infinite-scroll-disabled="disabled"
        infinite-scroll-immediate="false"
        infinite-scroll-delay="1000"
      >
        <el-table
          :data="list"
          v-loading="loading"
          :highlight-current-row="true"
          class="w-full"
          :header-cell-style="getHeaderStyle"
          row-class-name="custom-row"
        >
          <el-table-column
            v-if="isMdScreen"
            prop="id"
            label="ID"
            min-width="100"
            align="center"
          />

          <el-table-column
            prop="title"
            label="제목"
            min-width="450"
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
            v-if="isSmScreen"
            prop="registeredUserName"
            label="작성자"
            min-width="150"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.registeredUserName">
                {{ scope.row.registeredUserName }}
              </span>
              <span v-else>익명{{ scope.row.registeredBy }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isLgScreen"
            prop="formattedDate"
            label="작성일자"
            min-width="180"
            align="center"
          />
        </el-table>
        <div v-if="noMore">
          <el-empty :image-size="100" description="No more post!" />
        </div>
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

const currentPage: Ref<number> = ref(1);
const pageSize: Ref<number> = ref(30);
const totalCount: Ref<number> = ref(0);
const registeredBy: Ref<string> = ref("");
const currentBoardId: Ref<number> = ref(0);

const loading: Ref<boolean> = ref(false);
const noMore = computed(() => list.value.length >= totalCount.value);
const disabled = computed(() => loading.value || noMore.value);

const list: Ref<PostInfo[]> = ref([]);

const isLgScreen: Ref<boolean> = ref(false);
const isMdScreen: Ref<boolean> = ref(false);
const isSmScreen: Ref<boolean> = ref(false);

onMounted(async () => {
  if (process.client) {
    const handleResize = () => {
      isLgScreen.value = window.innerWidth >= 1024;
      isMdScreen.value = window.innerWidth >= 860;
      isMdScreen.value = window.innerWidth >= 640;
    };

    isLgScreen.value = window.innerWidth >= 1024;
    isMdScreen.value = window.innerWidth >= 860;
    isSmScreen.value = window.innerWidth >= 640;

    window.addEventListener("resize", handleResize);

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
    });
  }

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
