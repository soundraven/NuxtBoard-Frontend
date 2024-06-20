<template>
    <div>
        <UCard class="mx-10 my-4">
            <template #header> 내 정보</template>
            닉네임
            <template #footer>asd</template>
        </UCard>
        <UCard class="mx-10 my-4">
            <template #header> 내가 쓴 글</template>
            <div>글목록</div>
        </UCard>
        <UCard class="mx-10 my-4">
            <template #header> 내가 쓴 댓글</template>
            <div>댓글목록</div>
        </UCard>
    </div>
</template>
<script setup lang="ts">
onMounted(() => {})
</script>
