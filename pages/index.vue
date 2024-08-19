<template>
    <el-container class="w-full flex flex-col justify-center pt-[6px]">
        <el-container
            class="max-w-[1000px] h-full flex justify-center border border-[#E5EAF3] rounded shadow-sm p-[12px]"
        >
            <el-header
                height="250px"
                style="padding: 0px"
                class="w-full flex justify-center items-center border border-[#E5EAF3] rounded shadow-sm p-[12px] mb-[12px]"
            >
                광고 1을 위한 영역
            </el-header>
            <el-main
                style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px"
                class="w-full border border-[#E5EAF3] rounded shadow-sm p-[12px]"
            >
                <div
                    v-for="(board, index) in $indexStore.commoncode.boards"
                    :key="index"
                    class="h-[300px] border border-[#E5EAF3] rounded shadow-sm p-[12px]"
                >
                    <a
                        :href="`/post/list?boardId=${board.boardId}`"
                        class="text-[22px] font-bold underline underline-offset-[4px] decoration-2 decoration-[#409EFF]"
                    >
                        {{ board.boardName }}
                    </a>
                    <div
                        v-for="(post, index) in groupedPost[board.boardId]"
                        :key="index"
                        class="mt-[6px]"
                    >
                        <div
                            class="cursor-pointer"
                            @click="navigateTo(`/post/${post.id}`)"
                        >
                            {{ post.id }} {{ post.title }}
                            {{ getElapsedTime(post.formatted_date) }}
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
        <el-aside style="width: auto">
            <Sidebar />
        </el-aside>
    </el-container>
</template>

<script setup lang="ts">
import { Dayjs } from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import type { GroupedPost } from "~/types/interface"
import type { AxiosResponse } from "axios"
const { $axios, $indexStore, $dayjs, $catchError, $errorHandler } = useNuxtApp()

const currentPage: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(30)
const totalCount: Ref<number> = ref(0)

const groupedPost: Ref<GroupedPost> = ref([])
const list: Ref<GroupedPost> = ref([])

$dayjs.extend(relativeTime)

onMounted(async () => {
    getPostList()
    await $indexStore.commoncode.getBoards()
})

const getElapsedTime = (registeredDate: Dayjs) => {
    const convertedTime: Dayjs = $dayjs(registeredDate)
    return convertedTime.fromNow()
}

const getPostList = async () => {
    try {
        const postList: AxiosResponse = await $axios.get("/posts/list", {
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
</script>
