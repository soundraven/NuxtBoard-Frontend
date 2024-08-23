<template>
  <div class="w-full h-full flex justify-center">
    <el-container
      class="max-w-[1000px] h-full flex justify-center border-l border-r border-border-darkerBorder dark:border-darkBorder-darkerBorder dark:bg-darkBackground-lighterFill p-[12px] mx-[12px]"
    >
      <el-header
        height="250px"
        style="padding: 0px"
        class="border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill p-[12px] hidden lg:block"
      >
      </el-header>
      <el-main
        style="padding: 0"
        class="w-full h-full mt-[12px] xl:columns-[300px] lg:columns-[300px] md:columns-[340px] sm:columns-[240px]"
      >
        <div
          v-for="(board, index) in $indexStore.commoncode.boards"
          :key="index"
          class="break-inside-avoid-column border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill p-[12px] mb-[12px]"
        >
          <div
            @click="navigateTo(`/post/list?boardId=${board.boardId}`)"
            class="w-[50px] text-[22px] font-bold underline underline-offset-[4px] decoration-2 decoration-success cursor-pointer"
          >
            {{ board.boardName }}
          </div>
          <div
            v-for="(post, index) in groupedPost[board.boardId]"
            :key="index"
            class="mt-[6px]"
          >
            <div
              class="flex justify-between text-[14px] cursor-pointer"
              @click="navigateTo(`/post/${post.id}`)"
            >
              <span class="xl:w-[170px] truncate ... md:w-[170px] sm:w-[150px]"
                >{{ post.id }} {{ post.title }}</span
              >
              <span class="ml-[12px]">{{
                getElapsedTime(post.formatted_date)
              }}</span>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-aside style="width: auto">
      <Sidebar />
    </el-aside>
  </div>
</template>

<script setup lang="ts">
import { Dayjs } from "dayjs";
import type { GroupedPost } from "~/types/interface";
import type { AxiosResponse } from "axios";
const { $axios, $indexStore, $dayjs, $catchError, $errorHandler } =
  useNuxtApp();

const currentPage: Ref<number> = ref(1);
const pageSize: Ref<number> = ref(60);
const totalCount: Ref<number> = ref(0);

const groupedPost: Ref<GroupedPost> = ref([]);
const list: Ref<GroupedPost> = ref([]);

onMounted(async () => {
  getPostList();
  await $indexStore.commoncode.getBoards();
});

const getElapsedTime = (registeredDate: Dayjs) => {
  const convertedTime: Dayjs = $dayjs(registeredDate);
  return convertedTime.fromNow();
};

const getPostList = async () => {
  try {
    const postList: AxiosResponse = await $axios.get("/posts/list", {
      params: {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
      },
    });

    if (!$errorHandler(postList)) return;

    list.value = postList.data.postList;
    totalCount.value = postList.data.totalCount;
    groupedPost.value = postList.data.groupedPost;
  } catch (error: any) {
    $catchError(error);
  }
};
</script>
