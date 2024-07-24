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
                    v-for="(board, boardIndex) in $indexStore.commoncode
                        .boardNames"
                    class="h-[200px]"
                >
                    {{ board }}
                    <div v-for="(post, index) in groupedPost[boardIndex]">
                        <div
                            class="hover: cursor-pointer"
                            @click="navigateTo(`/post/${post.id}`)"
                        >
                            {{ post.id }} {{ post.title }}
                        </div>
                    </div>
                </el-card>
            </el-main>
        </el-container>
        <el-aside
            style="padding: 6px"
            class="w-[280px] min-h-[550px] flex flex-col items-center border-2 border-red-400 p-[10px] ml-[6px]"
        >
            <div class="w-full h-[200px] bg-gray-200 border-2 border-blue-400">
                우측 광고 or 개념글
            </div>
            <div
                class="w-full h-[150px] flex flex-wrap justify-around items-center border-2 mt-[6px] p-[6px] pb-[12px]"
            >
                <el-button
                    v-for="navBtn in $indexStore.commoncode.boardNames"
                    style="margin-top: 6px; margin-left: 0px"
                    class="w-[90px]"
                    @click="navigateTo(`/${navBtn}`)"
                >
                    {{ navBtn }}
                </el-button>

                <el-button type="danger" @click="getPostList"
                    >글 목록 로드</el-button
                >
            </div>
        </el-aside>
    </el-container>
</template>

<script setup lang="ts">
const { $axios, $indexStore } = useNuxtApp()

const currentPage: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(20)
const totalCount: Ref<number> = ref(0)

const groupedPost = ref([])

const list: Ref = ref([])

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
