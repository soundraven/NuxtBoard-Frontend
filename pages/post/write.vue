<template>
    <el-container class="w-full | flex flex-col justify-center">
        <el-container
            class="max-w-[1000px] h-auto border-[1px] border-[#E5EAF3] rounded shadow-sm p-[12px]"
        >
            <el-form :model="form" class="w-[1000px] mx-auto mt-[6px]">
                <el-form-item>
                    <el-select
                        v-model="form.boardId"
                        placeholder="please select your board"
                    >
                        <el-option
                            v-for="(option, index) in options"
                            :key="option.boardId"
                            :label="option.boardName"
                            :value="option.boardId"
                            v-if="options.length > 0"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="form.title"
                        style="width: 100%"
                        maxlength="50"
                        show-word-limit
                        :rows="1"
                        type="textarea"
                        placeholder="Please input your title"
                    />
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="form.content"
                        style="width: 100%"
                        :autosize="{ minRows: 30, maxRows: 30 }"
                        type="textarea"
                        placeholder="Please input your content"
                    />
                </el-form-item>
                <el-button @click="onSubmit">글 작성완료 </el-button>
            </el-form>
        </el-container>
        <el-aside style="width: auto">
            <Sidebar />
        </el-aside>
    </el-container>
</template>

<script setup lang="ts">
const { $axios, $indexStore, $catchError, $errorHandler } = useNuxtApp()

const route = useRoute()

definePageMeta({
    middleware: "auth",
})

const form = reactive({ title: "", content: "", boardId: 0 })

const options = computed(() => $indexStore.commoncode.boards)

onMounted(async () => {
    await $indexStore.commoncode.getBoards()
    const boardIdNum = Number(route.query.boardId)
    form.boardId = boardIdNum
})

const onSubmit = async () => {
    if (!form.boardId) {
        ElMessage.error("Please select a board.")
        return
    }

    try {
        const result = await $axios.post(
            "/posts/write",
            {
                post: form,
                user: $indexStore.auth.user,
            },
            {
                headers: {
                    requiresToken: true,
                },
            }
        )

        if (!$errorHandler(result)) return

        ElMessage(`${result.data.message}`)
        navigateTo(`/post/${result.data.postId}`)
    } catch (error: any) {
        $catchError(error)
    }
}
</script>
