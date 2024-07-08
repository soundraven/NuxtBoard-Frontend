<template>
    <div class="w-[1024px] min-h-[800px] mx-auto border-amber-300">
        <el-container>
            <el-container></el-container>
            <el-aside class="w-[200px] h-[800px] border-2 flex justify-evenly">
                <el-button
                    v-for="navBtn in navBtnArray"
                    class="w-16 mx-4 flex items-center justify-center"
                    @click="navigateTo(`/${navBtn}`)"
                >
                    {{ navBtn }}
                </el-button>
            </el-aside>
        </el-container>
    </div>
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
