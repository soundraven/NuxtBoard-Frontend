<template>
  <div class="hidden lg:block">
    <div
      class="w-[300px] border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill p-[12px] mt-[12px]"
    >
      최근 개념글
      <div v-for="(post, index) in list" class="w-[280px] mt-[6px]">
        <div
          v-if="index < 5"
          class="cursor-pointer"
          @click="navigateTo(`/post/${post.id}`)"
        >
          {{ post.id }} {{ post.title }}
          {{ getElapsedTime(post.registeredDate) }}
        </div>
      </div>
    </div>
    <div
      class="w-[300px] border border-border-darkerBorder dark:border-darkBorder-darkerBorder rounded shadow-sm bg-background-basicWhite dark:bg-darkBackground-darkerFill p-[12px] mt-[12px]"
    >
      이 채널의 개념글
      <div v-for="(post, index) in list" class="w-[280px] mt-[6px]">
        <div
          v-if="index < 5"
          class="cursor-pointer"
          @click="navigateTo(`/post/${post.id}`)"
        >
          {{ post.id }} {{ post.title }}
          {{ getElapsedTime(post.registeredDate) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Dayjs } from "dayjs";
import type { GroupedPost, PostInfo } from "~/types/interface";
import relativeTime from "dayjs/plugin/relativeTime";
const { $axios, $dayjs, $catchError, $errorHandler } = useNuxtApp();

$dayjs.extend(relativeTime);

const currentPage: Ref<number> = ref(1);
const pageSize: Ref<number> = ref(20);
const totalCount: Ref<number> = ref(0);

const groupedPost: Ref<GroupedPost> = ref([] as GroupedPost);
const list: Ref<PostInfo[]> = ref([] as PostInfo[]);

const getPostList = async () => {
  try {
    //api 쓸때 페이지 있는 쪽에 다 쓰지 말고 어디서 함수 하나 선언해 두고 getPostList
    const postList = await $axios.get("/posts/trendPosts"); // as GeneralServerResponse<PostList[]>

    if (!$errorHandler(postList)) return;

    list.value = postList.data.trendPosts;
  } catch (error: any) {
    $catchError(error);
  }
};

const getElapsedTime = (registeredDate: Dayjs) => {
  return $dayjs(registeredDate).fromNow();
};

onMounted(() => {
  getPostList();
});
</script>

<style></style>
