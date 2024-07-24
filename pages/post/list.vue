<template>
    <div class="flex justify-center">
        <el-table
            :data="list"
            style="width: 1000px; min-height: 840px"
            :highlight-current-row="true"
            class="mx-auto"
        >
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="board_id" label="게시판" />
            <el-table-column prop="title" label="제목">
                <template #default="scope">
                    <a
                        @click="goToPost(scope.row.id)"
                        class="text-blue-500 cursor-pointer"
                        >{{ scope.row.title }}</a
                    >
                </template>
            </el-table-column>
            <el-table-column prop="registered_by" label="작성자" />
            <el-table-column prop="registered_date" label="작성일자" />
        </el-table>
    </div>
    <div
        class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
        <el-pagination
            v-model="currentPage"
            :page-size="pageSize"
            :pager-count="11"
            layout="prev, pager, next"
            :total="totalCount"
            @current-change="handlePageChange"
        />
    </div>
</template>
<script setup lang="ts">
import type { ApiResponse } from "@/types/interface"

const router = useRouter()
const { $axios, $indexStore } = useNuxtApp()

const currentPage: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(20)
const totalCount: Ref<number> = ref(0)

const list: Ref = ref([])

const handlePageChange = (newPage: number) => {
    currentPage.value = newPage
    getPostList()
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
    } catch (error: any) {
        if (error.data && error.data.code === "E") {
            alert(`errorCode: ${error.data.errorCode}, ${error.data.message}`)
        } else {
            alert("Unknown error occurred. Please check and try again.")
        }
    }
}

const goToPost = (id: number) => {
    router.push(`/post/${id}`)
}

onMounted(() => {
    getPostList()
})
</script>
