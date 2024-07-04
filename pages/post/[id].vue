<template>
    <el-card class="w-9/12 mx-auto">
        <template #header>
            <div>
                {{ postinfo.title }}
            </div>
        </template>
        <div>{{ postinfo.content }}</div>
        <template #footer>Footer content</template>
    </el-card>
</template>
<script setup lang="ts">
import type { ApiResponse } from "~/structure/interface"

const route = useRoute()
const router = useRouter() //추후 뒤로가기 기능을 위해 사용

const config = useRuntimeConfig()
const api = config.public.apiBaseUrl

const postId = route.params.id

const postinfo: Ref<string[]> = ref([])

onMounted(async () => {
    const getPostinfo: ApiResponse = await $fetch(
        `${api}/posts/postinfo/${postId}`,
        {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        }
    )

    postinfo.value = getPostinfo.data[0]
})

const goBack = () => {
    router.push("/list")
}
</script>
