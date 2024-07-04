<template>
    <el-table :data="list" class="w-1024px mx-auto">
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
    <div
        class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
        <UPagination
            v-model="page"
            :page-count="pageCount"
            :total="list.length"
        />
    </div>

    <el-button type="primary" class="mb-4">Element Plus Button</el-button>
</template>
<script setup lang="ts">
import { type ApiResponse } from "~/structure/interface"

const config = useRuntimeConfig()
const api = config.public.apiBaseUrl

const router = useRouter()

const page: Ref<number> = ref(1)
const pageCount: Ref<number> = ref(10)

const list: Ref = ref([])

const rows = computed(() => {
    return list.value.slice(
        (page.value - 1) * pageCount.value,
        page.value * pageCount.value
    )
})

const getPostList = async () => {
    try {
        const postList: ApiResponse = await $fetch(`${api}/posts/list`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        })

        list.value = postList.data

        console.log(list.value[0])
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
