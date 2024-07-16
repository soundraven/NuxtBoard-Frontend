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
            <div class="flex items-center">
                <el-dropdown
                    v-if="authStore.isAuthenticated"
                    class="hover:cursor-pointer mr-[6px]"
                >
                    <el-button>{{ authStore.user.username }}</el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="authStore.logout()">
                                로그아웃
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-button type="info" @click="navigateTo('/mypage')">
                    <el-icon><User /></el-icon>
                </el-button>
            </div>
        </div>
    </div>
    <div class="mt-[0px]"><slot /></div>
</template>

<script setup lang="ts">
const keyword: Ref<string> = ref("")
const authStore = useAuthStore()
</script>
