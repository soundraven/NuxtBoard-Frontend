<template>
    <el-container
        class="w-[1280px] mx-auto flex flex-col flex-wrap items-center"
    >
        <el-container class="w-full h-full">
            <img
                src="https://img.ruliweb.com/view/2024/06/28/linm19480_1150x250_2.jpg"
                alt=""
                class="w-[1280px] h-[250px] object-cover"
            />
        </el-container>
        <el-container class="flex w-full">
            <el-container class="w-3/4 h-[550px] border-2 border-blue-400">
                content
            </el-container>
            <el-aside
                class="w-1/4 h-[550px] border-2 border-red-400 flex flex-col items-center"
            >
                <el-button type="primary" class="w-[240px] h-[30px] mt-2"
                    >로그인</el-button
                >
                <el-button class="w-[240px] h-[30px] mx-auto mt-2"
                    >회원가입</el-button
                >
                <el-container
                    class="flex content-start justify-evenly flex-wrap"
                >
                    <el-button
                        v-for="navBtn in navBtnArray"
                        class="w-1/4 mx-auto mt-2 flex items-center justify-center"
                        @click="navigateTo(`/${navBtn}`)"
                    >
                        {{ navBtn }}
                    </el-button></el-container
                >
            </el-aside>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
const navBtnArray: string[] = [
    "login",
    "register",
    "write",
    "list",
    "post",
    "mypage",
]
</script>
