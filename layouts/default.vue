<template>
    <div
        class="w-screen h-[50px] flex justify-center border-b border-blue-600 py-[6px] fixed top-0"
    >
        <div
            class="w-full max-w-[1300px] flex justify-between items-center px-[6px]"
        >
            <div>
                <el-button type="primary" @click="navigateTo('/')"
                    >Nuxtboard</el-button
                >
                <el-input
                    v-model="keyword"
                    style="width: 240px"
                    class="ml-[6px]"
                    placeholder="검색"
                />
            </div>
            <el-button type="info" @click="navigateTo('/mypage')"
                >Mypage</el-button
            >
        </div>
    </div>
    <div class="mt-[50px]"><slot /></div>
</template>

<script setup lang="ts">
const keyword: Ref<string> = ref("")
</script>
