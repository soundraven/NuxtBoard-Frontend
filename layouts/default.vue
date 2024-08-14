<template>
    <div class="bg-white dark:bg-black text-black dark:text-white">
        <div
            class="w-screen h-[50px] flex justify-center border-b-2 border-brandColor py-[6px] sticky top-0"
        >
            <div
                class="w-full max-w-[1300px] flex justify-between items-center px-[6px]"
            >
                <div>
                    <el-button type="primary" @click="navigateTo('/')">
                        Nuxtboard
                    </el-button>
                    <el-input
                        v-model="keyword"
                        style="width: 240px"
                        class="ml-[6px]"
                        placeholder="검색"
                    />
                </div>
                <div class="flex items-center">
                    <el-dropdown
                        v-if="$indexStore.auth.isAuthenticated"
                        class="hover:cursor-pointer mr-[6px]"
                    >
                        <el-button>
                            {{
                                $indexStore.auth.user.userName === ""
                                    ? "Please set your User name"
                                    : $indexStore.auth.user.userName
                            }}
                        </el-button>

                        <template #dropdown>
                            <el-dropdown-menu
                                v-if="$indexStore.auth.isAuthenticated"
                            >
                                <el-dropdown-item
                                    @click="navigateTo('/auth/mypage')"
                                >
                                    Mypage
                                </el-dropdown-item>
                                <el-dropdown-item
                                    divided
                                    @click="$indexStore.auth.logout"
                                >
                                    Logout
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-button v-else @click="navigateTo('/auth/login')">
                        Login
                    </el-button>
                    <el-button type="success" @click="toggleColorMode">
                        <el-icon><component :is="currentColorMode" /></el-icon>
                    </el-button>
                </div>
            </div>
        </div>
        <slot />
    </div>
</template>

<script setup lang="ts">
const keyword: Ref<string> = ref("")
const colorMode = useColorMode()

const { $indexStore } = useNuxtApp()

const currentColorMode = ref("Sunny")

const toggleColorMode = () => {
    colorMode.preference = colorMode.preference === "dark" ? "light" : "dark"
    setIconComponent()
}

const setIconComponent = () => {
    if (colorMode.preference === "light") {
        currentColorMode.value === "Sunny"
    } else {
        currentColorMode.value === "Moon"
    }
}
onMounted(() => {
    setIconComponent()
    console.log($indexStore.auth.user)
})
</script>
