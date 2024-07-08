<template>
    <el-card class="w-[1024px] h-[860px] mx-auto">
        <template #header>
            <div>
                {{ postinfo.title }}
            </div>
        </template>
        <div class="min-h-[500px]">{{ postinfo.content }}</div>
        <template #footer>Footer content</template>
    </el-card>
</template>
<script setup lang="ts">
import type { ApiResponse, Postinfo } from "~/structure/interface"

const route = useRoute()
const router = useRouter() //추후 뒤로가기 기능을 위해 사용

const config = useRuntimeConfig()
const api = config.public.apiBaseUrl

const postId = route.params.id

const postinfo: Ref<Postinfo> = ref({} as Postinfo)

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
