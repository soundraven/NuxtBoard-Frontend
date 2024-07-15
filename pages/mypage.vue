<template>
    <div class="flex justify-center">
        <el-card style="max-width: 480px">
            <template #header>
                <div class="card-header">
                    <span>사용자 정보 수정을 위한 공간</span>
                </div>
            </template>
            <template #default>
                <div>내가 쓴 글</div>
                <div>내가 쓴 댓글</div>
            </template>
        </el-card>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: "auth",
})

onMounted(() => {})
</script>
