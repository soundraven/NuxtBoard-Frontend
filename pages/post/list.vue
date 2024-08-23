<template>
  <el-container class="h-full flex flex-col justify-center">
    <div class="w-[1000px] mr-[12px]">
      <div
        class="w-full h-[150px] border border-border-darkerBorder dark:border-darkBorder-darkerBorder shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill p-[12px]"
      ></div>
      <el-tabs
        v-model="currentBoardId"
        type="card"
        @tab-click="changeTab"
        :stretch="true"
        class="h-[40px] border border-border-darkerBorder dark:border-darkBorder-darkerBorder shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill"
      >
        <el-tab-pane
          v-for="tab in $indexStore.commoncode.boards"
          :key="tab.boardId"
          :label="tab.boardName"
          :name="tab.boardId"
        />
      </el-tabs>
      <div
        class="w-full h-[660px] overflow-auto border-[1px] border-[#E5EAF3] rounded shadow-sm"
        v-infinite-scroll="getPostList"
        infinite-scroll-distance="500"
        :infinite-scroll-disabled="disabled"
        infinite-scroll-immediate="false"
        infinite-scroll-delay="1000"
      >
        <el-table
          :data="list"
          :highlight-current-row="true"
          class="w-full border-[1px] border-t-0 border-[#E5EAF3] shadow-sm mx-auto"
        >
          <el-table-column prop="id" label="ID" width="50" align="center" />
          <el-table-column
            prop="boardName"
            label="게시판"
            width="100"
            align="center"
          />
          <el-table-column prop="title" label="제목" width="480" align="center">
            <template #default="scope">
              <a
                @click="navigateTo(`${scope.row.id}`)"
                class="text-blue-500 cursor-pointer"
                >{{ scope.row.title }}</a
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="registeredUserName"
            label="작성자"
            width="100"
            align="center"
          />
          <el-table-column
            prop="formattedDate"
            label="작성일자"
            width="250"
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
import { ref, onMounted } from "vue";
import type { AxiosResponse } from "axios";
import type { PostInfo } from "~/types/interface";
import type { TabsPaneContext } from "element-plus";
const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp();

const route = useRoute();
const router = useRouter();

const currentPage = ref(1);
const pageSize = ref(30);
const totalCount = ref(0);
const registeredBy = ref<string>("");
const currentBoardId = ref<number>(0);

const loading = ref(false);
const noMore = computed(() => list.value.length >= totalCount.value);
const disabled = computed(() => loading.value || noMore.value);

const list = ref<PostInfo[]>([]);

onMounted(() => {
  const boardId = Number(route.query.boardId);
  if (boardId) {
    currentBoardId.value = boardId;
  }

  $indexStore.commoncode.getBoards().then(() => {
    getPostList();
  });
});

const getPostList = async () => {
  loading.value = true;
  try {
    const postList: AxiosResponse = await $axios.get("/posts/list", {
      params: {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        registeredBy: registeredBy.value,
        boardId: currentBoardId.value,
      },
    });

    if (!$errorHandler(postList)) return;

    list.value = [...list.value, ...postList.data.postList];
    totalCount.value = postList.data.totalCount;
    currentPage.value += 1;

    nextTick(() => {
      loading.value = false;
    });
  } catch (error: any) {
    $catchError(error);
    loading.value = false;
  }
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
</script>
