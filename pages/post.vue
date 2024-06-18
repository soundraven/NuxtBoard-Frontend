<template>
    <UContainer>
        <UCard
            :ui="{
                // base: '',
                // background: 'bg-white dark:bg-gray-900',
                // divide: 'divide-y divide-gray-200 dark:divide-gray-800',
                // ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
                // rounded: 'rounded-lg',
                // shadow: 'shadow',
                header: {
                    base: '',
                    background: '',
                    padding: 'px-4 py-5 sm:p-6',
                },
                default: {
                    base: '',
                    background: '',
                    padding: 'px-4 py-5 sm:px-6',
                },
                footer: {
                    base: '',
                    background: '',
                    padding: 'px-4 py-4 sm:px-6',
                },
            }"
        >
            <template #header>
                <div>헤더 영역입니다</div>
            </template>
            <template #default>
                <div class="bg-blue-500">글 내용입니다.</div>
            </template>
            <template #footer>
                <div>푸터 영역입니다</div>
            </template>
        </UCard>
    </UContainer>
</template>
<script setup lang="ts"></script>
