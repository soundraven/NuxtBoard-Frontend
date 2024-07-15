<template>
    <div class="flex justify-center">
        <el-table
            :data="list"
            style="width: 1000px; min-height: 840px"
            highlight-current-row="true"
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

    <el-button type="primary" class="mb-4">Element Plus Button</el-button>
</template>
<script setup lang="ts">
import { type ApiResponse } from "~/structure/interface"

const config = useRuntimeConfig()
const api = config.public.apiBaseUrl

const router = useRouter()

const currentPage: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(20)
const totalCount: Ref<number> = ref(0)

const list: Ref = ref([])

// const rows = computed(() => {
//     return list.value.slice(
//         (currentPage.value - 1) * pageSize.value,
//         currentPage.value * pageSize.value
//     )
// })

const handlePageChange = (newPage: number) => {
    currentPage.value = newPage
    getPostList()
}

const getPostList = async () => {
    try {
        const postList: ApiResponse = await $fetch(
            `${api}/posts/list?currentPage=${currentPage.value}&pageSize=${pageSize.value}`,
            {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                },
            }
        )

        list.value = postList.data.postList
        totalCount.value = postList.data.totalCount
        console.log(totalCount.value)
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
