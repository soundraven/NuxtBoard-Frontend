<template>
  <div class="w-full h-full flex justify-center">
    <el-container
      class="max-w-[1000px] h-full | flex justify-center | border-x border-border-darkerBorder dark:border-darkBorder-darkerBorder dark:bg-darkBackground-lighterFill pb-[12px] px-[12px] mx-[12px]"
    >
      <el-header
        height="250px"
        style="padding: 0px"
        class="border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill p-[12px] mt-[12px] | hidden lg:block"
      >
      </el-header>
      <el-main
        style="padding: 0; gap: 12px"
        class="w-full h-auto mt-[12px] xl:columns-[300px] lg:columns-[300px] md:columns-[340px] sm:columns-[240px]"
      >
        <div
          v-for="(board, index) in $indexStore.commoncode.boards"
          :key="index"
          class="break-inside-avoid-column border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill p-[12px] mb-[12px]"
        >
          <div
            @click="navigateTo(`/post/list?boardId=${board.boardId}`)"
            class="w-[50px] text-[22px] font-bold underline underline-offset-[6px] decoration-2 decoration-success cursor-pointer"
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
              <span
                class="xl:w-[200px] truncate md:w-[200px] sm:w-[170px] w-[320px]"
              >
                {{ post.title }}
              </span>
              <span class="w-full ml-[12px]">
                {{ getElapsedTime(post.formattedDate) }}
              </span>
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
import type { GroupedPost, PostInfo } from "~/types/interface";
const { $indexStore, $dayjs, $apiGet } = useNuxtApp();

const currentPage: Ref<number> = ref(1);
const pageSize: Ref<number> = ref(60);
const totalCount: Ref<number> = ref(0);

const groupedPost: Ref<GroupedPost> = ref([]);
const list: Ref<PostInfo[]> = ref([]);

onMounted(async () => {
  await $indexStore.commoncode.getBoards();
  getPostList();
});

const getElapsedTime = (registeredDate: Dayjs) => {
  const convertedTime: Dayjs = $dayjs(registeredDate);
  return convertedTime.fromNow();
};

const getPostList = async () => {
  const result = await $apiGet<{
    postList: PostInfo[];
    totalCount: number;
    groupedPost: GroupedPost;
  }>("/posts/list", {
    currentPage: currentPage.value,
    pageSize: pageSize.value,
  });

  list.value = result.data?.postList || [];
  totalCount.value = result.data?.totalCount || 0;
  groupedPost.value = result.data?.groupedPost || [];
};
</script>
