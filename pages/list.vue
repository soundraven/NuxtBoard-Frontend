<template>
    <UContainer>
        <UTable :rows="rows" />
        <div
            class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
        >
            <UPagination
                v-model="page"
                :page-count="pageCount"
                :total="list.length"
            />
        </div>
    </UContainer>
</template>
<script setup lang="ts">
import { type ApiResponse } from "~/structure/interface"

const config = useRuntimeConfig()
const api = config.public.apiBaseUrl

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
