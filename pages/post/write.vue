<template>
    <el-container
        class="w-full h-[800px] flex flex-col justify-center pt-[6px]"
    >
        <el-container
            class="max-w-[1000px] h-full flex justify-center border-2 border-green-400 p-[6px]"
        >
            <el-form :model="form" class="w-[1000px] mx-auto mt-[6px]">
                <el-form-item>
                    <el-select
                        v-model="form.boardId"
                        placeholder="please select your board"
                    >
                        <el-option
                            v-for="(option, index) in options"
                            :key="option.id"
                            :label="option.label"
                            :value="option.value"
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
        <el-aside
            style="padding: 6px"
            class="w-[280px] min-h-[550px] flex flex-col items-center border-2 border-red-400 p-[10px] ml-[6px]"
        >
            <Sidebar />
        </el-aside>
    </el-container>

    <div></div>
</template>
<script setup lang="ts">
import Cookies from "js-cookie"
const { $axios, $indexStore } = useNuxtApp()

definePageMeta({
    middleware: "auth",
})

const form = reactive({ title: "", content: "", boardId: "" })

const options = computed(() =>
    $indexStore.commoncode.boards.map((board) => ({
        value: board.id,
        label: board.name,
    }))
)

onMounted(() => {
    console.log(options.value)
})

const onSubmit = async () => {
    try {
        const token = Cookies.get("token")
        console.log(form)

        if (!token) {
            alert("token is missing")
            $indexStore.auth.logout()
            return
        }

        const result = await $axios.post(
            "/posts/write",
            {
                post: form,
                user: $indexStore.auth.user,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (result.data.code === "E" || "F") {
            alert(`${result.data.message}`)
            return
        }

        alert(`${result.data.message}`)
        // navigateTo(`/${result.data.postId}`)
    } catch (error: any) {
        if (error.data && error.data.code === "E") {
            alert(`errorCode: ${error.data.errorCode}, ${error.data.message}`)
        } else {
            alert("Unknown error occurred. Please check and try again.")
        }
    }
}
</script>
