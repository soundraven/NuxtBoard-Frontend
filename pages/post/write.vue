<template>
    <el-form :model="form" class="w-[1000px] mx-auto mt-[6px]">
        <el-form-item label="Title">
            <UTextarea
                v-model="form.title"
                :rows="1"
                size="xl"
                placeholder="글 내용을 작성해 주세요"
            />
        </el-form-item>
        <el-form-item label="Content">
            <UTextarea
                v-model="form.content"
                resize
                autoresize
                :maxrows="20"
                class="min-h-30 max-h-400px"
                placeholder="글 내용을 작성해 주세요"
            />
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
const form = reactive({ title: "", content: "" })

const onSubmit = () => {
    console.log(form.title, form.content)
}
</script>
