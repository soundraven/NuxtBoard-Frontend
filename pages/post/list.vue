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
                        @click="navigateTo(`${scope.row.id}`)"
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
import type { AxiosResponse } from "axios"
import { catchError, errorHandler } from "~/utils/tryCatchFunctions"

const { $axios, $indexStore } = useNuxtApp()

const currentPage: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(20)
const totalCount: Ref<number> = ref(0)
const registeredBy: Ref<string> = ref("")

const list: Ref = ref([])

const handlePageChange = (newPage: number) => {
    currentPage.value = newPage
    getPostList()
}

const getPostList = async () => {
    try {
        const postList: AxiosResponse = await $axios.get("/posts/list", {
            params: {
                currentPage: currentPage.value,
                pageSize: pageSize.value,
                registeredBy: registeredBy.value,
            },
        })

        if (!errorHandler(postList)) return

        list.value = postList.data.postList
        totalCount.value = postList.data.totalCount
    } catch (error: any) {
        catchError(error)
    }
}

onMounted(() => {
    getPostList()
})
</script>
