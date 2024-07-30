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
    <el-button
        v-if="$indexStore.auth.user.id === postinfo.registered_by"
        type="primary"
        @click="navigateTo(`/post/edit/${route.params.id}`)"
        >글수정</el-button
    >
</template>
<script setup lang="ts">
import type { ApiResponse, Postinfo } from "~/types/interface"
import type { AxiosInstance, AxiosResponse } from "axios"

const { $axios, $indexStore } = useNuxtApp()

const route = useRoute()
const router = useRouter() //추후 뒤로가기 기능을 위해 사용

const postId: string = route.params.id as string
console.log(route.params.id)

const postinfo: Ref<Postinfo> = ref({} as Postinfo)

const getPostinfo = async (postId: string) => {
    try {
        const response = await $axios.get(`/posts/postinfo/${postId}`)
        postinfo.value = response.data.postinfo
    } catch (error: any) {
        if (error.data && error.data.code === "E") {
            alert(`errorCode: ${error.data.errorCode}, ${error.data.message}`)
        } else {
            alert("Unknown error occurred. Please check and try again.")
        }
    }
}

onMounted(() => {
    getPostinfo(postId)
})

const goBack = () => {
    router.push("/list")
}
</script>
