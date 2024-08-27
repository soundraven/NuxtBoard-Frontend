<template>
  <div class="hidden lg:block mr-[12px]">
    <div
      class="w-[300px] border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill p-[12px] mt-[12px]"
    >
      최근 개념글
      <div v-for="(post, index) in list" class="w-[280px] mt-[6px]">
        <div
          v-if="index < 5"
          class="text-[14px] | flex justify-between | cursor-pointer"
          @click="navigateTo(`/post/${post.id}`)"
        >
          {{ post.title }}
          <span class="truncate ...">
            {{ getElapsedTime(post.registeredDate) }}
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="$route.path !== '/'"
      class="w-[300px] border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill p-[12px] mt-[12px]"
    >
      이 채널의 개념글
      <div v-for="(post, index) in trendList" class="w-[280px] mt-[6px]">
        <div
          v-if="index < 5"
          class="text-[14px] | flex justify-between | cursor-pointer"
          @click="navigateTo(`/post/${post.id}`)"
        >
          <span> {{ post.title }}</span>
          <span>
            {{ getElapsedTime(post.registeredDate) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Dayjs } from "dayjs";
import type { PostInfo } from "~/types/interface";

const { $dayjs, $apiGet } = useNuxtApp();

const route = useRoute();

const list: Ref<PostInfo[]> = ref([] as PostInfo[]);
const trendList: Ref<PostInfo[]> = ref([] as PostInfo[]);

onMounted(() => {
  getPostList();
});

const getPostList = async () => {
  const boardId = route.query.boardId;

  const result = await $apiGet<{
    trendPosts: PostInfo[];
    currentBoardTrendPosts: PostInfo[];
  }>(`/posts/trendPosts?boardId=${boardId}`);

  list.value = result.data?.trendPosts || [];
  trendList.value = result.data?.currentBoardTrendPosts || [];
};

const getElapsedTime = (registeredDate: Dayjs) => {
  return $dayjs(registeredDate).fromNow();
};

watch(
  () => route.query.boardId,
  (newBoardId, oldBoardId) => {
    if (newBoardId !== oldBoardId) {
      getPostList();
    }
  }
);
</script>

<style></style>
