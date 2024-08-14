<template>
    <div
        class="w-[300px] border-[1px] border-[#E5EAF3] rounded shadow-sm p-[6px] ml-[12px]"
    >
        최근 개념글
        <div v-for="(post, index) in list" class="w-280px mt-[6px]">
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
        class="w-[300px] border-[1px] border-[#E5EAF3] rounded shadow-sm p-[6px] mt-[12px] ml-[12px]"
    >
        이 채널의 개념글
        <div v-for="(post, index) in list" class="w-280px mt-[6px]">
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

    <el-button type="primary" @click="navigateTo('/post/write')"
        >글작성</el-button
    >
    <el-button type="primary" @click="navigateTo('/post/list')"
        >게시글 목록</el-button
    >
</template>

<script lang="ts" setup>
import type { Dayjs } from "dayjs"
import type { GroupedPost, PostInfo } from "~/types/interface"
const { $axios, $dayjs, $catchError, $errorHandler } = useNuxtApp()

const currentPage: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(20)
const totalCount: Ref<number> = ref(0)

const groupedPost: Ref<GroupedPost> = ref([] as GroupedPost)
const list: Ref<PostInfo[]> = ref([] as PostInfo[])

const getPostList = async () => {
    try {
        //api 쓸때 페이지 있는 쪽에 다 쓰지 말고 어디서 함수 하나 선언해 두고 getPostList
        const postList = await $axios.get("/posts/list", {
            params: {
                currentPage: currentPage.value,
                pageSize: pageSize.value,
            },
        }) // as GeneralServerResponse<PostList[]>

        if (!$errorHandler(postList)) return

        list.value = postList.data.postList
        totalCount.value = postList.data.totalCount
        groupedPost.value = postList.data.groupedPost
    } catch (error: any) {
        $catchError(error)
    }
}

const getElapsedTime = (registeredDate: Dayjs) => {
    const convertedTime = $dayjs(registeredDate)
    const now = $dayjs()

    const days = Math.abs(convertedTime.diff(now, "day"))
    const hours = Math.abs(convertedTime.diff(now, "hour"))
    const minutes = Math.abs(convertedTime.diff(now, "minute"))

    if (minutes < 1) {
        return `방금 전`
    } else if (minutes < 60) {
        return `${minutes}분 전`
    } else if (hours < 24) {
        return `${hours}시간 전`
    } else {
        return `${days}일 전`
    }
}

onMounted(() => {
    getPostList()
})
</script>

<style></style>
