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

        <template #footer>
            <UTextarea
                v-model="content"
                resize
                autoresize
                class="min-h-80"
                placeholder="글 내용을 작성해 주세요"
            />
        </template>
    </UCard>
</template>
<script setup lang="ts">
const title: Ref<string> = ref("")
const content: Ref<string> = ref("")
</script>
