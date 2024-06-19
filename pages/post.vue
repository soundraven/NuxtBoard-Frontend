<template>
    <UContainer>
        <UCard>
            <template #header>
                <div class="flex">
                    <div>글 제목</div>
                    <div>글 작성자</div>
                </div>
            </template>
            <div class="">글 내용입니다.</div>
            <template #footer>
                <div>푸터 영역입니다</div>
            </template>
        </UCard>
    </UContainer>
</template>
<script setup lang="ts"></script>
