<template>
    <div class="w-full bg-gray-200 border-2 border-blue-400">
        <div v-for="(post, index) in list">
            <div
                class="hover: cursor-pointer"
                @click="navigateTo(`/post/${post.id}`)"
            >
                {{ post.id }} {{ post.title }}
                {{ getElapsedTime(post.registered_date) }}
            </div>
        </div>
    </div>
    <div
        class="w-full h-[150px] flex flex-wrap justify-around items-center border-2 mt-[6px] p-[6px] pb-[12px]"
    >
        <!-- <el-button
            v-for="navBtn in $indexStore.commoncode.boards"
            style="margin-top: 6px; margin-left: 0px"
            class="w-[90px]"
            @click="navigateTo(`/${navBtn}`)"
        >
            {{ navBtn }} </el-button
        >//추후 수정 필요 -->
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
import type { GroupedPost, Postinfo } from "~/types/interface"
const { $axios, $dayjs, $catchError, $errorHandler } = useNuxtApp()

const currentPage: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(20)
const totalCount: Ref<number> = ref(0)

const groupedPost: Ref<GroupedPost> = ref([] as GroupedPost)
const list: Ref<Postinfo[]> = ref([] as Postinfo[])

const getPostList = async () => {
    try {
        //api 쓸때 페이지 있는 쪽에 다 쓰지 말고 어디서 함수 하나 선언해 두고 getPostList
        const postList = await $axios.get("/posts/list", {
            params: {
                currentPage: currentPage.value,
                pageSize: pageSize.value,
            },
        })

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
