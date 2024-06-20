<template>
    <UCard>
        <template #header>
            <UTextarea
                v-model="title"
                :rows="1"
                size="xl"
                placeholder="글 내용을 작성해 주세요"
            />
        </template>
        <UTextarea
            v-model="content"
            resize
            autoresize
            :maxrows="20"
            class="min-h-30 max-h-400px"
            placeholder="글 내용을 작성해 주세요"
        />
        <template #footer>
            <UButton @click="onSubmit">작성</UButton>
        </template>
    </UCard>
</template>
<script setup lang="ts">
const title: Ref<string> = ref("")
const content: Ref<string> = ref("")

onMounted(() => {})

const onSubmit = () => {
    console.log(title.value, content.value)
}
</script>
