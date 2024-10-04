<template>
  <div class="hidden xl:inline mr-[12px]">
    <div
      class="w-[300px] | border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill | p-[12px] mt-[12px]"
    >
      최근 개념글
      <div v-for="(post, index) in slicedTrendList" class="w-[280px] mt-[6px]">
        <div
          class="text-[14px] | flex justify-between | cursor-pointer"
          @click="navigateTo(`/post/${post.id}`)"
        >
          <span class="w-[200px] truncate">{{ post.title }}</span>
          <span>{{ getElapsedTime(post.registeredDate) }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="$route.path !== '/'"
      class="w-[300px] | border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill | p-[12px] mt-[12px]"
    >
      이 채널의 개념글
      <div
        v-for="(post, index) in slicedCurrentBoardTrendList"
        class="w-[280px] mt-[6px]"
      >
        <div
          class="flex justify-between text-[14px] cursor-pointer"
          @click="navigateTo(`/post/${post.id}`)"
        >
          <span class="w-[200px] truncate"> {{ post.title }}</span>
          <span>{{ getElapsedTime(post.registeredDate) }}</span>
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

const trendList: Ref<PostInfo[]> = ref([]);
const currentBoardTrendList: Ref<PostInfo[]> = ref([]);

const slicedTrendList: ComputedRef<PostInfo[]> = computed(() => {
  return trendList.value.slice(0, 5);
});

const slicedCurrentBoardTrendList: ComputedRef<PostInfo[]> = computed(() => {
  return trendList.value.slice(0, 5);
});

onMounted(() => {
  getPostList();
});

const getPostList = async () => {
  const boardId = route.query.boardId;

  const result = await $apiGet<{
    trendPosts: PostInfo[];
    currentBoardTrendPosts: PostInfo[];
  }>(`/posts/trendPosts?boardId=${boardId}`);

  trendList.value = result.data?.trendPosts || [];
  currentBoardTrendList.value = result.data?.currentBoardTrendPosts || [];
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
