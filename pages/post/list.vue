<template>
    <el-container class="flex justify-center">
        <div
            class="overflow-auto"
            style="height: 800px; width: 1000px"
            v-infinite-scroll="getPostList"
            infinite-scroll-distance="200"
            :infinite-scroll-disabled="disabled"
            infinite-scroll-immediate="false"
            infinite-scroll-delay="1000"
        >
            <el-table
                :data="list"
                style="width: 100%"
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
            <p v-if="loading">Loading...</p>
            <p v-if="noMore">No more Post</p>
        </div>
        <el-aside
            style="padding: 6px"
            class="w-[280px] min-h-[550px] flex flex-col items-center border-2 border-red-400 p-[10px] ml-[6px]"
        >
            <Sidebar />
        </el-aside>
    </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { AxiosResponse } from "axios"
import type { Postinfo } from "~/types/interface"
const { $axios, $catchError, $errorHandler } = useNuxtApp()

const currentPage = ref(1)
const pageSize = ref(30)
const totalCount = ref(0)
const registeredBy = ref("")
const loading = ref(false)
const noMore = computed(() => list.value.length >= totalCount.value)
const disabled = computed(() => loading.value || noMore.value)

const list = ref<Postinfo[]>([])

const getPostList = async () => {
    loading.value = true
    console.log(loading.value)
    try {
        console.log("글 불러오기")
        const postList: AxiosResponse = await $axios.get("/posts/list", {
            params: {
                currentPage: currentPage.value,
                pageSize: pageSize.value,
                registeredBy: registeredBy.value,
            },
        })

        if (!$errorHandler(postList)) return

        list.value = [...list.value, ...postList.data.postList]
        totalCount.value = postList.data.totalCount
        currentPage.value += 1
        // setTimeout(() => {
        //     loading.value = false
        //     console.log(loading.value, disabled)
        // }, 1000)
        nextTick(() => {
            loading.value = false
            console.log(loading.value, disabled)
        })
        // loading.value = false
    } catch (error: any) {
        $catchError(error)
        loading.value = false
    }
}

onMounted(() => {
    getPostList()
})
</script>

<style scoped>
.overflow-auto {
    overflow: auto;
}
</style>
