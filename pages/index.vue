<template>
    <div class="w-screen flex flex-col items-center">
        <el-header
            height="240px"
            style="padding: 0px"
            class="w-[1300px] bg-gray-200"
        >
            광고 1을 위한 영역
        </el-header>
        <el-container>
            <el-main
                style="padding: 0px"
                class="w-[1000px] border-2 border-blue-400"
            >
                content
            </el-main>
            <el-aside
                style="padding: 0px"
                class="w-[280px] h-[550px] flex flex-col items-center border-2 border-red-400 p-[10px]"
            >
                <div
                    class="flex flex-col flex-wrap items-center border-2 p-[6px]"
                >
                    <el-button
                        type="primary"
                        class="w-[240px] h-[30px] mb-[6px]"
                        @click="navigateTo('/login')"
                        >로그인</el-button
                    >
                    <el-button
                        class="w-[240px] h-[30px]"
                        style="margin: 0px"
                        @click="navigateTo('/register')"
                        >회원가입</el-button
                    >
                </div>
                <div class="w-[240px] flex flex-wrap">
                    <button
                        v-for="navBtn in navBtnArray"
                        class="w-[60px]"
                        @click="navigateTo(`/${navBtn}`)"
                    >
                        {{ navBtn }}
                    </button>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script setup lang="ts">
const navBtnArray: string[] = ["유머", "공지", "질문", "공략", "자랑", "후기"]
</script>
