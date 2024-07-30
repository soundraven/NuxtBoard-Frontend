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
                    class="h-[200px]"
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
const { $axios, $indexStore, $dayjs } = useNuxtApp()

const currentPage: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(20)
const totalCount: Ref<number> = ref(0)

const groupedPost = ref([])
const list = ref([])

const getElapsedTime = (registeredDate: Dayjs) => {
    const convertedTime = $dayjs(registeredDate)
    const now = $dayjs()

    const days = convertedTime.diff(now, "day") * -1
    const hours = convertedTime.diff(now, "hour") * -1
    const minutes = convertedTime.diff(now, "minute") * -1

    if (minutes < 1) {
        return `방금 전`
    } else if (minutes < 24) {
        return `${minutes}분 전`
    } else if (hours < 24) {
        return `${hours}시간 전`
    } else {
        return `${days}일 전`
    }
}

const getPostList = async () => {
    try {
        //api 쓸때 페이지 있는 쪽에 다 쓰지 말고 어디서 함수 하나 선언해 두고 getPostList
        const postList = await $axios.get("/posts/list", {
            params: {
                currentPage: currentPage.value,
                pageSize: pageSize.value,
            },
        })

        list.value = postList.data.postList
        totalCount.value = postList.data.totalCount

        groupedPost.value = postList.data.groupedPost
        console.log(groupedPost.value)
    } catch (error: any) {
        if (error.data && error.data.code === "E") {
            alert(`errorCode: ${error.data.errorCode}, ${error.data.message}`)
        } else {
            alert("Unknown error occurred. Please check and try again.")
        }
    }
}

onMounted(() => {
    getPostList()
})
</script>
