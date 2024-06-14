<template>
    <div :class="$style.index">
        <UContainer>
            <UAccordion multiple :items="explain" />
            <UButton class="mx-8" @click="goToPage('login')">login</UButton>
            <UButton class="mx-8" @click="goToPage('sign')">sign</UButton>
            <UButton class="mx-8" @click="goToPage('write')">write</UButton>
            <UButton class="mx-8" @click="goToPage('post')">post</UButton>
        </UContainer>
    </div>
    <button class="w-screen bg-red-500">테스트</button>
</template>

<script setup lang="ts">
import { navigateTo } from "#app"

const explain = [
    {
        label: "Purpose",
        icon: "i-heroicons-information-circle",
        defaultOpen: true,
        content:
            "기존 Vue3으로 작성한 게시판을 Nuxt3으로 마이그레이션하였습니다.",
    },
    {
        label: "Explanation",
        icon: "i-heroicons-installation-circle",
        content:
            "NuxtUI의 NuxtColorMode, TailwindCSS, 컴포넌트 등을 활용하여 글 작성, 수정, 삭제, 게시글 조회 등의 기능을 구현하였습니다.",
    },
]

const goToPage = (destination: string) => {
    navigateTo(`/${destination}`)
}
</script>

<style lang="scss" module>
.index {
    width: 100vw;
}
</style>
