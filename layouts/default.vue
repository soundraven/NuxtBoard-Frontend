<template>
  <div
    class="w-full min-h-screen bg-background-pageBackground dark:bg-darkBackground-pageBackground text-text-primaryText dark:text-darkText-primaryText"
  >
    <div
      class="h-[50px] flex justify-center bg-brandColor dark:bg-darkBackground-lighterFill border border-brandColor dark:border-darkBorder-darkerBorder py-[6px] sticky top-0 z-10"
    >
      <div class="w-full max-w-[1320px] flex justify-between items-center">
        <div class="flex items-center">
          <el-button @click="navigateTo('/')">Nuxtboard</el-button>
          <div class="hidden sm:block">
            <el-input
              v-model="keyword"
              class="w-[240px] ml-[6px]"
              placeholder="검색"
            />
          </div>
        </div>
        <div class="flex items-center">
          <el-dropdown
            v-if="$indexStore.auth.isAuthenticated"
            class="hover:cursor-pointer mr-[6px]"
          >
            <el-badge
              v-if="
                $indexStore.auth.isAuthenticated &&
                $indexStore.auth.user.userName === ''
              "
              is-dot
            >
              <el-button>닉네임을 지정해 주세요</el-button>
            </el-badge>
            <el-button v-else>
              {{ $indexStore.auth.user.userName }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="navigateTo('/auth/mypage')">
                  마이페이지
                </el-dropdown-item>
                <el-dropdown-item divided @click="$indexStore.auth.logout">
                  로그아웃
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button v-else @click="navigateTo('/auth/login')">
            로그인
          </el-button>
          <el-button
            type="info"
            class="ml-[6px] bg-background-darkerFill dark:bg-darkBackground-darkerFill text-white"
            @click="toggleColorMode"
          >
            <client-only>
              <el-icon><component :is="currentColorIcon" /></el-icon>
            </client-only>
          </el-button>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const keyword: Ref<string> = ref("");
const colorMode = useColorMode();

const { $indexStore } = useNuxtApp();

const currentColorIcon = computed(() => {
  return colorMode.preference === "light" ? "Sunny" : "Moon";
});

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
};

onMounted(() => {
  console.log($indexStore.auth.user);
});
</script>
