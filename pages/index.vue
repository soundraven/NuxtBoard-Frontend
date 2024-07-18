<template>
    <el-container class="w-full flex flex-col justify-center pt-[6px]">
        <el-container
            class="max-w-[1000px] h-full flex justify-center border-2 border-green-400 p-[6px]"
        >
            <el-header
                height="200px"
                style="padding: 0px"
                class="w-full flex justify-center items-center bg-gray-200 border-2 border-blue-400"
            >
                광고 1을 위한 영역
            </el-header>
            <el-main
                style="
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr;
                    gap: 6px;
                    padding: 6px;
                "
                class="w-full h-full border-2 border-blue-400 mt-[6px]"
            >
                <el-card v-for="(card, index) in cards" class="h-[300px]">
                    {{ card }}{{ index + 1 }}
                </el-card>
            </el-main>
        </el-container>
        <el-aside
            style="padding: 6px"
            class="w-[280px] min-h-[550px] flex flex-col items-center border-2 border-red-400 p-[10px] ml-[6px]"
        >
            <div class="w-full h-[200px] bg-gray-200 border-2 border-blue-400">
                우측 광고 or 개념글
            </div>
            <div
                class="w-full flex flex-col flex-wrap items-center border-2 mt-[6px] p-[6px]"
            >
                <el-button
                    type="primary"
                    class="w-full h-[30px] mb-[6px]"
                    @click="navigateTo('/auth/login')"
                    >로그인</el-button
                >
                <el-button
                    class="w-full h-[30px]"
                    style="margin: 0px"
                    @click="navigateTo('/auth/register')"
                    >회원가입</el-button
                >
            </div>
            <div
                class="w-full h-[150px] flex flex-wrap justify-around items-center border-2 mt-[6px] p-[6px] pb-[12px]"
            >
                <el-button
                    v-for="navBtn in navBtnArray"
                    style="margin-top: 6px; margin-left: 0px"
                    class="w-[90px]"
                    @click="navigateTo(`/${navBtn}`)"
                >
                    {{ navBtn }}
                </el-button>
            </div>
        </el-aside>
    </el-container>
</template>

<script setup lang="ts">
const navBtnArray: string[] = ["공지", "유머", "질문", "공략", "자랑", "후기"]
const cards = ["게시판", "게시판", "게시판", "게시판", "게시판", "게시판"]
</script>
