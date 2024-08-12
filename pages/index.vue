<template>
    <el-container class="w-full flex flex-col justify-center pt-[6px]">
        <el-container
            class="max-w-[1000px] h-full flex justify-center border-2 border-green-400 p-[6px]"
        >
            <el-header
                height="250px"
                style="padding: 0px"
                class="w-full flex justify-center items-center bg-gray-200 border-2 border-blue-400"
            >
                광고 1을 위한 영역
            </el-header>
            <el-main
                style="
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr;
                    gap: 6px;
                    padding: 6px;
                "
                class="w-full h-full border-2 border-blue-400 mt-[6px]"
            >
                <el-card
                    v-for="(board, index) in $indexStore.commoncode.boards"
                >
                    {{ board.name }}
                    <div v-for="(post, index) in groupedPost[board.id]">
                        <div
                            class="hover: cursor-pointer"
                            @click="navigateTo(`/post/${post.id}`)"
                        >
                            {{ post.id }} {{ post.title }}
                            {{ getElapsedTime(post.formatted_date) }}
                        </div>
                    </div>
                </el-card>
            </el-main>
        </el-container>
        <el-aside
            style="padding: 6px"
            class="w-[280px] min-h-[550px] flex flex-col items-center border-2 border-red-400 p-[10px] ml-[6px]"
        >
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

onMounted(() => {
    getPostList()
})
</script>
