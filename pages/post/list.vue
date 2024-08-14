<template>
    <el-container class="flex justify-center">
        <div
            class="overflow-auto border-[1px] border-[#E5EAF3] shadow-sm p-[6px]"
            style="height: 1000px; width: 1000px"
            v-infinite-scroll="getPostList"
            infinite-scroll-distance="250"
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
                <el-table-column prop="boardName" label="게시판" />
                <el-table-column prop="title" label="제목">
                    <template #default="scope">
                        <a
                            @click="navigateTo(`${scope.row.id}`)"
                            class="text-blue-500 cursor-pointer"
                            >{{ scope.row.title }}</a
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="registeredUserName" label="작성자" />
                <el-table-column prop="registeredDate" label="작성일자" />
            </el-table>
            <p v-if="loading">Loading...</p>
            <p v-if="noMore">No more Post</p>
        </div>
        <el-aside style="width: auto">
            <Sidebar />
        </el-aside>
    </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { AxiosResponse } from "axios"
import type { PostInfo } from "~/types/interface"
const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp()

const currentPage = ref(1)
const pageSize = ref(30)
const totalCount = ref(0)
const registeredBy = ref("")

const loading = ref(false)
const noMore = computed(() => list.value.length >= totalCount.value)
const disabled = computed(() => loading.value || noMore.value)

const list = ref<PostInfo[]>([])

onMounted(() => {
    getPostList()
    $indexStore.commoncode.getBoards()
})

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

        nextTick(() => {
            loading.value = false
        })
    } catch (error: any) {
        $catchError(error)
        loading.value = false
    }
}
</script>

<style scoped>
.overflow-auto {
    overflow: auto;
}
</style>
